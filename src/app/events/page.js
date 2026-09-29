import Link from "next/link";
import EventExplorer from "@/components/EventExplorer.jsx";

export default function EventsPage() {
  return (
    <main>
      <Link href="/">← Back to Home</Link>

      <h1>Campus Events</h1>

      <EventExplorer />
    </main>
  );
}