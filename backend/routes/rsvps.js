const express = require("express");

const pool = require("../config/db");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

// RSVP to an event
router.post("/:eventId", authenticateToken, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { status } = req.body;

    const validStatuses = ["going", "maybe", "declined"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Status must be going, maybe, or declined",
      });
    }

    // Check event exists
    const [events] = await pool.query(
      "SELECT id FROM events WHERE id = ?",
      [eventId]
    );

    if (events.length === 0) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // Check whether user already RSVP'd
    const [existing] = await pool.query(
      "SELECT id FROM rsvps WHERE event_id = ? AND user_id = ?",
      [eventId, req.user.userId]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: "You have already RSVP'd to this event",
      });
    }

    // Create RSVP
    const [result] = await pool.query(
      `INSERT INTO rsvps (event_id, user_id, status)
       VALUES (?, ?, ?)`,
      [eventId, req.user.userId, status]
    );

    res.status(201).json({
      message: "RSVP created successfully",
      rsvp: {
        id: result.insertId,
        event_id: Number(eventId),
        user_id: req.user.userId,
        status,
      },
    });
  } catch (error) {
    console.error("RSVP error:", error);

    res.status(500).json({
      message: "Failed to create RSVP",
    });
  }
});

module.exports = router;