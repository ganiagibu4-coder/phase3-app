import Link from "next/link";

export default function FavouritesPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <Link href="/" className="text-blue-600 hover:underline">
        ← Back to Home
      </Link>

      <div className="mx-auto mt-12 max-w-4xl text-center">
        <h1 className="text-4xl font-bold text-slate-900">Favourites</h1>
        <p className="mt-4 text-slate-600">
          Favourites screen placeholder. Saved events will appear here.
        </p>
      </div>
    </main>
  );
}