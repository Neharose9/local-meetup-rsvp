const express = require("express");

const pool = require("../config/db");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

// Create an event
router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      event_date,
    } = req.body;

    if (!title || !location || !event_date) {
      return res.status(400).json({
        message: "Title, location, and event date are required",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO events
       (title, description, location, event_date, created_by)
       VALUES (?, ?, ?, ?, ?)`,
      [
        title,
        description || null,
        location,
        event_date,
        req.user.userId,
      ]
    );

    res.status(201).json({
      message: "Event created successfully",
      event: {
        id: result.insertId,
        title,
        description: description || null,
        location,
        event_date,
        created_by: req.user.userId,
      },
    });
  } catch (error) {
    console.error("Create event error:", error);

    res.status(500).json({
      message: "Failed to create event",
    });
  }
});

// Get all events
router.get("/", async (req, res) => {
  try {
    const [events] = await pool.query(`
      SELECT
        e.id,
        e.title,
        e.description,
        e.location,
        e.event_date,
        e.created_by,
        e.created_at,
        u.name AS creator_name,
        u.email AS creator_email
      FROM events e
      JOIN users u ON e.created_by = u.id
      ORDER BY e.event_date ASC
    `);

    res.json({
      events,
    });
  } catch (error) {
    console.error("Get events error:", error);

    res.status(500).json({
      message: "Failed to fetch events",
    });
  }
});

// Get one event with attendees
router.get("/:id", async (req, res) => {
  try {
    const eventId = req.params.id;

    const [events] = await pool.query(
      `SELECT
        e.id,
        e.title,
        e.description,
        e.location,
        e.event_date,
        e.created_by,
        u.name AS creator_name,
        u.email AS creator_email
       FROM events e
       JOIN users u ON e.created_by = u.id
       WHERE e.id = ?`,
      [eventId]
    );

    if (events.length === 0) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    const [attendees] = await pool.query(
      `SELECT
        u.id,
        u.name,
        u.email,
        r.status
       FROM rsvps r
       JOIN users u ON r.user_id = u.id
       WHERE r.event_id = ?
       ORDER BY u.name ASC`,
      [eventId]
    );

    res.json({
      event: events[0],
      attendees,
    });
  } catch (error) {
    console.error("Get event details error:", error);

    res.status(500).json({
      message: "Failed to fetch event details",
    });
  }
});
// Update an event
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const eventId = req.params.id;

    const {
      title,
      description,
      location,
      event_date,
    } = req.body;

    if (!title || !location || !event_date) {
      return res.status(400).json({
        message: "Title, location, and event date are required",
      });
    }

    

    // Check whether the event exists and belongs to the logged-in user
    const [events] = await pool.query(
      "SELECT id, created_by FROM events WHERE id = ?",
      [eventId]
    );

    if (events.length === 0) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (events[0].created_by !== req.user.userId) {
      return res.status(403).json({
        message: "You can only update your own events",
      });
    }

    await pool.query(
      `UPDATE events
       SET title = ?,
           description = ?,
           location = ?,
           event_date = ?
       WHERE id = ?`,
      [
        title,
        description || null,
        location,
        event_date,
        eventId,
      ]
    );

    res.json({
      message: "Event updated successfully",
      event: {
        id: Number(eventId),
        title,
        description: description || null,
        location,
        event_date,
        created_by: req.user.userId,
      },
    });
  } catch (error) {
    console.error("Update event error:", error);

    res.status(500).json({
      message: "Failed to update event",
    });
  }
});

// Delete an event
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const eventId = req.params.id;

    // Check whether the event exists
    const [events] = await pool.query(
      "SELECT id, created_by FROM events WHERE id = ?",
      [eventId]
    );

    if (events.length === 0) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // Check ownership
    if (events[0].created_by !== req.user.userId) {
      return res.status(403).json({
        message: "You can only delete your own events",
      });
    }

    await pool.query(
      "DELETE FROM events WHERE id = ?",
      [eventId]
    );

    res.json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Delete event error:", error);

    res.status(500).json({
      message: "Failed to delete event",
    });
  }
});
module.exports = router;