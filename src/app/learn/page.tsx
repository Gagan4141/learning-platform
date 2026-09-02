import { redirect } from "next/navigation";
import { LearningWorkspace } from "@/components/LearningWorkspace";
import { NavBar } from "@/components/NavBar";
import { getCurrentUser } from "@/lib/auth";
import { n5Content } from "@/lib/content";

export default async function LearnPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="mx-auto w-full max-w-6xl space-y-4 px-4 py-6">
        <h1 className="text-2xl font-semibold">Integrated N5 Learning</h1>
        <p className="text-sm opacity-80">Speaking, listening, writing, reading, vocabulary, grammar, and kana/kanji in one flow.</p>
        <LearningWorkspace lessons={n5Content.lessons} />
      </main>
    </div>
  );
}
