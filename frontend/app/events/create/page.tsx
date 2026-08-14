"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
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
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create event");
        return;
      }

      router.push(`/events/${data.event.id}`);
    } catch {
      setError("Could not connect to the backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">

        <button
          onClick={() => router.push("/events")}
          className="text-blue-600 mb-6 hover:underline"
        >
          ← Back to Events
        </button>

        <div className="bg-white rounded-xl shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create Meetup
          </h1>

          <p className="text-gray-500 mt-2 mb-8">
            Create a new local meetup event.
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
                placeholder="Developer Meetup"
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
                placeholder="Describe your meetup..."
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
                placeholder="Kochi"
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
              disabled={loading}
              className="w-full bg-blue-600 text-white rounded-lg py-3 font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Event"}
            </button>

          </form>
        </div>
      </div>
    </main>
  );
}