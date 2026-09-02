import { redirect } from "next/navigation";
import { NavBar } from "@/components/NavBar";
import { getCurrentUser } from "@/lib/auth";
import { n5Content } from "@/lib/content";

export default async function AssessmentPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const grammarSet = n5Content.lessons.filter((lesson) => lesson.skill === "grammar").slice(0, 3);
  const listeningSet = n5Content.listening.slice(0, 3);
  const readingSet = n5Content.reading.slice(0, 3);

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6">
        <h1 className="text-2xl font-semibold">N5 Mini Mock Test</h1>
        <section className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
          <h2 className="font-semibold">Grammar & Vocabulary</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {grammarSet.map((lesson) => (
              <li key={lesson.id}>{lesson.quiz[0]?.question}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
          <h2 className="font-semibold">Listening</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {listeningSet.map((item) => (
              <li key={item.id}>{item.prompt}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
          <h2 className="font-semibold">Reading</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {readingSet.map((item) => (
              <li key={item.id}>{item.question}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
