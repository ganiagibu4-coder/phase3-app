import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="flex flex-col gap-3 border-b bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="text-xl font-bold text-slate-900">
          CampusConnect
        </Link>

        <div className="flex flex-wrap gap-4">
          <Link href="/" className="text-slate-700 hover:text-blue-600">
            Home
          </Link>

          <Link href="/events" className="text-slate-700 hover:text-blue-600">
            Events
          </Link>

          <Link
            href="/favourites"
            className="text-slate-700 hover:text-blue-600"
          >
            Favourites
          </Link>

          <Link href="/health" className="text-slate-700 hover:text-blue-600">
            Health
          </Link>
        </div>
      </nav>

      <section className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600">
          Campus Events
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Welcome to CampusConnect
        </h1>

        <p className="mt-5 max-w-2xl text-lg text-slate-600">
          Discover events happening on campus and stay connected with your
          student community.
        </p>

        <Link
          href="/events"
          className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Explore Events
        </Link>
      </section>
    </main>
  );
}