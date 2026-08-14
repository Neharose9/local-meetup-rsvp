"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();

  const eventId = params.id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load existing event
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
        const event = data.event;

        setTitle(event.title);
        setDescription(event.description || "");
        setLocation(event.location);

        // Convert ISO date into datetime-local format
        const date = new Date(event.event_date);

        const formattedDate =
          date.getFullYear() +
          "-" +
          String(date.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(date.getDate()).padStart(2, "0") +
          "T" +
          String(date.getHours()).padStart(2, "0") +
          ":" +
          String(date.getMinutes()).padStart(2, "0");

        setEventDate(formattedDate);
      })
      .catch(() => {
        setError("Failed to load event");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [eventId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError("");
    setSaving(true);

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/events/${eventId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            description,
            location,
            event_date: eventDate,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update event");
        return;
      }

      router.push(`/events/${eventId}`);
    } catch {
      setError("Could not connect to the backend");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-2xl mx-auto">
          <p>Loading event...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">

        <button
          onClick={() => router.push(`/events/${eventId}`)}
          className="text-blue-600 mb-6 hover:underline"
        >
          ← Back to Event
        </button>

        <div className="bg-white rounded-xl shadow p-8">

          <h1 className="text-3xl font-bold text-gray-900">
            Edit Event
          </h1>

          <p className="text-gray-500 mt-2 mb-8">
            Update your meetup details.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date and Time
              </label>

              <input
                type="datetime-local"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
              />
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 rounded-lg p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 text-white rounded-lg py-3 font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

          </form>
        </div>
      </div>
    </main>
  );
}