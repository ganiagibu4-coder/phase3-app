import Link from "next/link";

async function getHealthData() {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos/1", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch health data");
  }

  return response.json();
}

export default async function HealthPage() {
  const data = await getHealthData();

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <Link href="/" className="text-blue-600 hover:underline">
        ← Back to Home
      </Link>

      <div className="mx-auto mt-12 max-w-2xl rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">
          Health Check
        </h1>

        <p className="mt-2 text-slate-600">
          Successfully fetched data from an external API.
        </p>

        <div className="mt-6 rounded-lg bg-slate-100 p-5">
          <p className="text-sm text-slate-500">Fetched data</p>

          <p className="mt-2 font-medium text-slate-900">
            Todo #{data.id}: {data.title}
          </p>

          <p className="mt-2 text-sm text-slate-600">
            Completed: {data.completed ? "Yes" : "No"}
          </p>
        </div>
      </div>
    </main>
  );
}
