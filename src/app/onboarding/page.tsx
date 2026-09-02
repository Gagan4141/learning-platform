"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function OnboardingPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        level: form.get("level"),
        dailyMinutes: Number(form.get("dailyMinutes")),
        goal: form.get("goal"),
      }),
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Onboarding failed");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-6 py-8">
      <form onSubmit={onSubmit} className="w-full space-y-4 rounded-xl border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-zinc-900">
        <h1 className="text-2xl font-semibold">Onboarding</h1>
        <p className="text-sm opacity-85">We use this to generate your personalized N5 plan.</p>
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Current level</legend>
          <label className="block text-sm"><input type="radio" name="level" value="beginner" defaultChecked className="mr-2" />Absolute beginner</label>
          <label className="block text-sm"><input type="radio" name="level" value="exposed" className="mr-2" />Some N5 exposure</label>
        </fieldset>
        <label className="block text-sm">
          Daily study minutes
          <input type="number" name="dailyMinutes" min={15} max={180} defaultValue={45} className="mt-1 w-full rounded border px-3 py-2" />
        </label>
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Primary goal</legend>
          <label className="block text-sm"><input type="radio" name="goal" value="exam" defaultChecked className="mr-2" />JLPT N5 exam prep</label>
          <label className="block text-sm"><input type="radio" name="goal" value="conversation" className="mr-2" />Practical conversation</label>
        </fieldset>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button className="rounded bg-black px-4 py-2 text-white dark:bg-white dark:text-black">Generate my plan</button>
      </form>
    </main>
  );
}
