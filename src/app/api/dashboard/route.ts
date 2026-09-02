import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scoreAccuracy } from "@/lib/learning";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [profile, progress, speakingAttempts, listeningScores] = await Promise.all([
    prisma.onboardingProfile.findUnique({ where: { userId: user.id } }),
    prisma.skillProgress.findMany({ where: { userId: user.id } }),
    prisma.speakingAttempt.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.listeningScore.findMany({ where: { userId: user.id }, orderBy: { score: "desc" }, take: 10 }),
  ]);

  const totalCorrect = progress.reduce((sum, stat) => sum + Math.round((stat.accuracy / 100) * 10), 0);
  const totalChecks = progress.length * 10;

  return NextResponse.json({
    profile,
    analytics: {
      skillAccuracy: progress.map((p) => ({ skill: p.skill, accuracy: p.accuracy, timeSpentMin: p.timeSpentMin, mastered: p.mastered })),
      globalAccuracy: scoreAccuracy(totalCorrect, totalChecks),
    },
    speakingAttempts,
    listeningLeaderboard: listeningScores,
  });
}
