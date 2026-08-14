"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type EventData = {
  id: number;
  title: string;
  description: string;
  location: string;
  event_date: string;
  created_by: number;
  creator_name: string;
};

type Attendee = {
  id: number;
  name: string;
  email: string;
  status: string;
};

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [event, setEvent] = useState<EventData | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const eventId = params.id;

  // Load event details
  useEffect(() => {
    fetch(`http://localhost:5000/api/events/${eventId}`)
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load event");
        }

        return data;
      })
      .then((data) => {
        setEvent(data.event);
        setAttendees(data.attendees || []);
      })
      .catch(() => {
        setMessage("Failed to load event");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [eventId]);

  // Load logged-in user
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // RSVP
  const handleRSVP = async () => {
    setMessage("");

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
      return;
    }

    if (!status) {
      setMessage("Please select an RSVP status");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/rsvps/${eventId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "RSVP failed");
        return;
      }

      setMessage("RSVP submitted successfully");

      // Reload attendees
      const eventResponse = await fetch(
        `http://localhost:5000/api/events/${eventId}`
      );

      const eventData = await eventResponse.json();

      setAttendees(eventData.attendees || []);
    } catch {
      setMessage("Could not connect to the backend");
    }
  };

  // Delete event
  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    if (!token || !event) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/events/${event.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setActionMessage(
          data.message || "Failed to delete event"
        );
        return;
      }

      router.push("/events");
    } catch {
      setActionMessage("Could not connect to the backend");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <p>Loading event...</p>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <p className="text-red-600">
          {message || "Event not found"}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => router.push("/events")}
          className="text-blue-600 mb-6 hover:underline"
        >
          ← Back to Events
        </button>

        <div className="bg-white rounded-xl shadow p-8">

          {/* Event information */}
          <h1 className="text-3xl font-bold text-gray-900">
            {event.title}
          </h1>

          <p className="text-gray-600 mt-4">
            {event.description}
          </p>

          <div className="mt-6 space-y-2 text-gray-700">
            <p>📍 {event.location}</p>

            <p>
              📅 {new Date(event.event_date).toLocaleString()}
            </p>

            <p>
              👤 Created by {event.creator_name}
            </p>
          </div>

          {/* Edit / Delete buttons */}
          {currentUser &&
            currentUser.id === event.created_by && (
              <div className="flex gap-3 mt-6">

                <button
                  onClick={() =>
                    router.push(`/events/${event.id}/edit`)
                  }
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700"
                >
                  Edit Event
                </button>

                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-700"
                >
                  Delete Event
                </button>

              </div>
            )}

          {actionMessage && (
            <p className="mt-4 text-red-600">
              {actionMessage}
            </p>
          )}

          <hr className="my-8" />

          {/* RSVP */}
          <h2 className="text-xl font-bold text-gray-900">
            RSVP
          </h2>

          <div className="flex gap-3 mt-4 flex-wrap">

            <button
              onClick={() => setStatus("going")}
              className={`px-5 py-2 rounded-lg border ${
                status === "going"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Going
            </button>

            <button
              onClick={() => setStatus("maybe")}
              className={`px-5 py-2 rounded-lg border ${
                status === "maybe"
                  ? "bg-yellow-500 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Maybe
            </button>

            <button
              onClick={() => setStatus("declined")}
              className={`px-5 py-2 rounded-lg border ${
                status === "declined"
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Declined
            </button>

          </div>

          <button
            onClick={handleRSVP}
            className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Submit RSVP
          </button>

          {message && (
            <p className="mt-4 text-sm text-gray-700">
              {message}
            </p>
          )}

          <hr className="my-8" />

          {/* Attendees */}
          <h2 className="text-xl font-bold text-gray-900">
            Attendees ({attendees.length})
          </h2>

          <div className="mt-4 space-y-3">

            {attendees.length === 0 ? (
              <p className="text-gray-500">
                No RSVPs yet.
              </p>
            ) : (
              attendees.map((attendee) => (
                <div
                  key={attendee.id}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {attendee.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {attendee.email}
                    </p>
                  </div>

                  <span className="text-sm font-medium">
                    {attendee.status}
                  </span>
                </div>
              ))
            )}

          </div>

        </div>
      </div>
    </main>
  );
}