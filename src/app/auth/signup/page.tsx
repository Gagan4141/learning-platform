"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SignupPage() {
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
      name: String(form.get("name") ?? ""),
    };

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Signup failed");
      return;
    }

    router.push("/onboarding");
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <form onSubmit={onSubmit} className="w-full space-y-3 rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <input name="name" placeholder="Name" className="w-full rounded border px-3 py-2" required />
        <input name="email" placeholder="Email" type="email" className="w-full rounded border px-3 py-2" required />
        <input name="password" placeholder="Password" type="password" minLength={8} className="w-full rounded border px-3 py-2" required />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button disabled={loading} className="w-full rounded bg-black px-4 py-2 text-white dark:bg-white dark:text-black">
          {loading ? "Creating..." : "Create and continue"}
        </button>
        <p className="text-sm">
          Already have an account? <Link href="/auth/login" className="underline">Log in</Link>
        </p>
      </form>
    </main>
  );
}
