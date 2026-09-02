import { redirect } from "next/navigation";
import { NavBar } from "@/components/NavBar";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ReviewPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const cards = await prisma.reviewCard.findMany({
    where: { userId: user.id },
    orderBy: { dueAt: "asc" },
    take: 20,
  });

  const mistakes = await prisma.mistakeNote.findMany({ where: { userId: user.id, resolved: false }, take: 10 });

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-6">
        <h1 className="text-2xl font-semibold">SRS Review + Error Notebook</h1>
        <section className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
          <h2 className="font-semibold">Due cards</h2>
          <ul className="mt-2 space-y-2 text-sm">
            {cards.map((card) => (
              <li key={card.id} className="rounded border border-black/10 p-2 dark:border-white/10">
                <p>{card.prompt} → {card.answer}</p>
                <form action="/api/review" method="post" className="mt-2 flex items-center gap-2">
                  <input type="hidden" name="cardId" value={card.id} />
                  <label>
                    Grade
                    <select name="grade" defaultValue="3" className="ml-2 rounded border px-2 py-1">
                      {[0, 1, 2, 3, 4, 5].map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </label>
                  <button className="rounded bg-black px-2 py-1 text-white dark:bg-white dark:text-black">Update</button>
                </form>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
          <h2 className="font-semibold">Mistake notebook</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {mistakes.map((m) => (
              <li key={m.id}>{m.skill}: expected &quot;{m.expected}&quot;, got &quot;{m.actual}&quot;</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
