"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check if the user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.replace("/events");
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Save authentication information
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Replace login page instead of adding it to browser history
      router.replace("/events");
    } catch {
      setError("Cannot connect to the backend server");
    } finally {
      setLoading(false);
    }
  };

  // While checking authentication
  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">
          Checking authentication...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center text-gray-900">
          Local Meetup RSVP
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Sign in to continue
        </p>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="neha@example.com"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter your password"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-100 text-red-700 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-lg py-3 font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>

        </form>

        <div className="mt-6 text-sm text-gray-500 text-center">
          Demo user: neha@example.com
        </div>

      </div>
    </main>
  );
}