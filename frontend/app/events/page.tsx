"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Event = {
  id: number;
  title: string;
  description: string;
  location: string;
  event_date: string;
  creator_name: string;
};

export default function EventsPage() {
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load events
  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load events");
        }

        return data;
      })
      .then((data) => {
        setEvents(data.events || []);
      })
      .catch(() => {
        setError("Failed to load events");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/");
  };

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/events"
            className="text-2xl font-bold text-blue-600"
          >
            LocalMeet
          </Link>

          {/* Navbar buttons */}
          <div className="flex items-center gap-3">

            <Link
              href="/events/create"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              + Create Event
            </Link>

            <button
              onClick={handleLogout}
              className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Logout
            </button>

          </div>
        </div>
      </nav>

      {/* Main content */}
      <section className="max-w-6xl mx-auto px-6 py-10">

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            Upcoming Meetups
          </h1>

          <p className="text-slate-500 mt-2">
            Discover and join local events near you.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <p className="text-slate-500">
              Loading events...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
            {error}
          </div>
        )}

        {/* No events */}
        {!loading && !error && events.length === 0 && (
          <div className="bg-white rounded-xl p-10 text-center shadow-sm">

            <h2 className="text-xl font-semibold text-slate-800">
              No events yet
            </h2>

            <p className="text-slate-500 mt-2">
              Create the first meetup!
            </p>

            <Link
              href="/events/create"
              className="inline-block mt-5 bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Create Event
            </Link>

          </div>
        )}

        {/* Event cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden"
            >

              {/* Card top */}
              <div className="h-2 bg-blue-600" />

              <div className="p-6">

                {/* Title */}
                <h2 className="text-xl font-bold text-slate-900">
                  {event.title}
                </h2>

                {/* Description */}
                <p className="text-slate-500 mt-2 line-clamp-2">
                  {event.description}
                </p>

                {/* Event information */}
                <div className="mt-5 space-y-3 text-sm">

                  <div className="flex gap-3">
                    <span>📍</span>
                    <span className="text-slate-700">
                      {event.location}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <span>📅</span>
                    <span className="text-slate-700">
                      {new Date(event.event_date).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <span>👤</span>
                    <span className="text-slate-700">
                      {event.creator_name}
                    </span>
                  </div>

                </div>

                {/* Details button */}
                <Link
                  href={`/events/${event.id}`}
                  className="block text-center mt-6 bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition"
                >
                  View Details
                </Link>

              </div>
            </div>
          ))}

        </div>
      </section>
    </main>
  );
}