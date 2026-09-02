"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const payload = {
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    };

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Login failed");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <form onSubmit={onSubmit} className="w-full space-y-3 rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <input name="email" placeholder="Email" type="email" className="w-full rounded border px-3 py-2" required />
        <input name="password" placeholder="Password" type="password" minLength={8} className="w-full rounded border px-3 py-2" required />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button disabled={loading} className="w-full rounded bg-black px-4 py-2 text-white dark:bg-white dark:text-black">
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <p className="text-sm">
          New learner? <Link href="/auth/signup" className="underline">Create account</Link>
        </p>
      </form>
    </main>
  );
}
