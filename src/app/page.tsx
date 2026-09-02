import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-8 px-6 py-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">N5 FastTrack Japanese Platform</h1>
        <p className="max-w-3xl text-lg opacity-90">
          Full JLPT N5 learning flow with onboarding, study plans, speaking/listening/writing/reading practice,
          SRS-based review, active recall, interleaving, mock tests, analytics, streaks, XP, badges, and seeded
          content for immediate learning.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          "Hiragana & Katakana",
          "N5 Kanji + Vocabulary",
          "Grammar + Reading",
          "Listening + Speaking + Writing",
        ].map((item) => (
          <div key={item} className="rounded-xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900">
            {item}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href="/auth/signup" className="rounded-full bg-black px-5 py-2 text-white dark:bg-white dark:text-black">
          Create account
        </Link>
        <Link href="/auth/login" className="rounded-full border border-black/20 px-5 py-2 dark:border-white/20">
          Login
        </Link>
      </div>
      <p className="text-sm opacity-80">Demo credentials after seed: demo@n5fast.jp / demo12345</p>
    </main>
  );
}
