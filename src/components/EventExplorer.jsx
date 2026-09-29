"use client";

import { useEffect, useMemo, useState } from "react";
import { categories, events } from "@/data/events";

const STORAGE_KEY = "campusconnect-favourites";

function formatDate(date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export default function EventExplorer({ favouritesOnly = false }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [favourites, setFavourites] = useState([]);
  const [isReady, setIsReady] = useState(false);

  // AI recommendation state
  const [interests, setInterests] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      setFavourites(saved ? JSON.parse(saved) : []);
    } catch {
      setFavourites([]);
    } finally {
      setIsReady(true);
    }
  }, []);

  // Ask Gemini for event recommendations
  const getRecommendations = async () => {
    if (!interests.trim()) {
      setAiError("Please enter your interests first.");
      return;
    }

    setAiLoading(true);
    setAiError("");
    setRecommendations([]);

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interests,
          events,
        }),
      });

      const data = await response.json();

if (!response.ok) {
  setAiError(data?.error || "AI request failed.");
  setAiLoading(false);
  return;
}

setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error(error);
      setAiError(
        error?.message || "We couldn't generate recommendations right now."
      );
    } finally {
      setAiLoading(false);
    }
  };

  const toggleFavourite = (eventId) => {
    setFavourites((current) => {
      const next = current.includes(eventId)
        ? current.filter((id) => id !== eventId)
        : [...current, eventId];

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

      return next;
    });
  };

  const filteredEvents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return events.filter((event) => {
      const matchesCategory =
        category === "All" || event.category === category;

      const matchesQuery =
        !normalizedQuery ||
        `${event.title} ${event.category} ${event.venue} ${event.description}`
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesFavourite =
        !favouritesOnly || favourites.includes(event.id);

      return matchesCategory && matchesQuery && matchesFavourite;
    });
  }, [category, favourites, favouritesOnly, query]);

  if (!isReady) {
    return (
      <div
        className="rounded-xl bg-white p-6 text-slate-600 shadow-sm"
        role="status"
      >
        Loading events…
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* AI Recommendations */}
      {!favouritesOnly && (
        <section
          aria-labelledby="ai-recommendations-heading"
          className="rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 p-6 shadow-sm ring-1 ring-purple-100"
        >
          <h2
            id="ai-recommendations-heading"
            className="text-2xl font-bold text-slate-900"
          >
            ✨ AI Event Recommendations
          </h2>

          <p className="mt-2 text-slate-600">
            Tell us what you are interested in, and AI will suggest events
            that match.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <label htmlFor="ai-interests" className="sr-only">
              Your interests
            </label>

            <input
              id="ai-interests"
              type="text"
              value={interests}
              onChange={(event) => setInterests(event.target.value)}
              placeholder="e.g. AI, coding, cybersecurity"
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
            />

            <button
              type="button"
              onClick={getRecommendations}
              disabled={aiLoading}
              className="rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {aiLoading ? "Finding events..." : "Recommend Events"}
            </button>
          </div>

          {aiError && (
            <p className="mt-3 text-sm text-red-600" role="alert">
              {aiError}
            </p>
          )}

          {recommendations.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="font-semibold text-slate-900">
                Recommended for you
              </h3>

              {recommendations.map((recommendation, index) => (
                <article
                  key={`${recommendation.title}-${index}`}
                  className="rounded-lg bg-white p-4 shadow-sm"
                >
                  <h4 className="font-semibold text-slate-900">
                    {recommendation.title}
                  </h4>

                  <p className="mt-1 text-sm text-slate-600">
                    {recommendation.reason}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Search and filters */}
      {!favouritesOnly && (
        <div className="mt-6 space-y-5 rounded-xl bg-white p-5 shadow-sm">
          <div>
            <label
              htmlFor="event-search"
              className="font-semibold text-slate-900"
            >
              Search events
            </label>

            <input
              id="event-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by event, category, or venue"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <span className="font-semibold text-slate-900">Category</span>

            <div
              className="mt-2 flex flex-wrap gap-2"
              aria-label="Event categories"
            >
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  aria-pressed={category === item}
                  className={`rounded-full px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    category === item
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results information */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-sm text-slate-600" aria-live="polite">
          {filteredEvents.length}{" "}
          {filteredEvents.length === 1 ? "event" : "events"} found
        </p>

        <p className="text-sm text-slate-500">
          {favourites.length} saved
        </p>
      </div>

      {/* Empty state */}
      {filteredEvents.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-xl font-semibold text-slate-900">
            {favouritesOnly
              ? "No favourite events yet"
              : "No events found"}
          </h2>

          <p className="mt-2 text-slate-600">
            {favouritesOnly
              ? "Save an event from the Events page and it will appear here."
              : "Try a different search term or category."}
          </p>
        </div>
      ) : (
        /* Event cards */
        <div className="grid gap-5 md:grid-cols-2">
          {filteredEvents.map((event) => {
            const isFavourite = favourites.includes(event.id);

            return (
              <article
                key={event.id}
                className="flex h-full flex-col rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {event.category}
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleFavourite(event.id)}
                    aria-pressed={isFavourite}
                    aria-label={`${isFavourite ? "Remove" : "Save"} ${
                      event.title
                    } ${
                      isFavourite
                        ? "from favourites"
                        : "to favourites"
                    }`}
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {isFavourite ? "★ Saved" : "☆ Save"}
                  </button>
                </div>

                <h2 className="mt-4 text-xl font-bold text-slate-900">
                  {event.title}
                </h2>

                <p className="mt-2 flex-1 text-slate-600">
                  {event.description}
                </p>

                <dl className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
                  <div className="flex justify-between gap-4">
                    <dt className="font-medium text-slate-900">
                      Date
                    </dt>
                    <dd>{formatDate(event.date)}</dd>
                  </div>

                  <div className="flex justify-between gap-4">
                    <dt className="font-medium text-slate-900">
                      Time
                    </dt>
                    <dd>{event.time}</dd>
                  </div>

                  <div className="flex justify-between gap-4">
                    <dt className="font-medium text-slate-900">
                      Venue
                    </dt>
                    <dd>{event.venue}</dd>
                  </div>
                </dl>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
