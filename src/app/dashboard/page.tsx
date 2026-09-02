import { redirect } from "next/navigation";
import { NavBar } from "@/components/NavBar";
import { n5Content, skillOrder } from "@/lib/content";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { adaptiveDifficulty, buildInterleavingQueue } from "@/lib/learning";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const profile = await prisma.onboardingProfile.findUnique({ where: { userId: user.id } });
  if (!profile) redirect("/onboarding");

  const dueCards = await prisma.reviewCard.count({ where: { userId: user.id, dueAt: { lte: new Date() } } });
  const stats = await prisma.skillProgress.findMany({ where: { userId: user.id } });
  const listeningTop = await prisma.listeningScore.findMany({
    where: { userId: user.id },
    orderBy: { score: "desc" },
    take: 5,
  });
  const avgAccuracy = stats.length ? stats.reduce((sum, s) => sum + s.accuracy, 0) / stats.length : 0;
  const difficulty = adaptiveDifficulty(avgAccuracy);

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6">
        <section className="grid gap-4 md:grid-cols-4">
          <Card title="Streak" value={`${profile.streak} days`} />
          <Card title="XP" value={`${profile.xp}`} />
          <Card title="Due review cards" value={`${dueCards}`} />
          <Card title="Adaptive mode" value={difficulty} />
        </section>

        <section className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold">Today&apos;s plan</h2>
          <p className="mt-2 text-sm opacity-90">{profile.studyPlan}</p>
          <p className="mt-2 text-sm">Interleaving queue: {buildInterleavingQueue([...skillOrder], 9).join(" → ")}</p>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
            <h3 className="font-semibold">Continue learning</h3>
            <ul className="mt-2 space-y-1 text-sm">
              {n5Content.lessons.slice(0, 8).map((lesson) => (
                <li key={lesson.id}>
                  {lesson.title} · <span className="opacity-80">{lesson.skill}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
            <h3 className="font-semibold">Weak skills diagnostics</h3>
            <p className="mt-2 text-sm">{profile.weakSkills}</p>
            <p className="mt-2 text-sm">Badges: {profile.badges}</p>
          </article>
        </section>

        <section className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
          <h3 className="font-semibold">Listening game leaderboard (you)</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {listeningTop.map((entry) => (
              <li key={entry.id}>
                {entry.gameType}: {entry.score} pts ({entry.accuracy}%)
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
      <p className="text-sm opacity-75">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
