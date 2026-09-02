export type ReviewGrade = 0 | 1 | 2 | 3 | 4 | 5;

export function scheduleSrsReview(
  easeFactor: number,
  repetitions: number,
  intervalDays: number,
  grade: ReviewGrade,
): { easeFactor: number; repetitions: number; intervalDays: number; dueAt: Date } {
  const boundedEase = Math.max(1.3, easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)));

  if (grade < 3) {
    return {
      easeFactor: boundedEase,
      repetitions: 0,
      intervalDays: 1,
      dueAt: addDays(1),
    };
  }

  const nextReps = repetitions + 1;
  let nextInterval = 1;

  if (nextReps === 2) {
    nextInterval = 3;
  } else if (nextReps > 2) {
    nextInterval = Math.max(1, Math.round(intervalDays * boundedEase));
  }

  return {
    easeFactor: boundedEase,
    repetitions: nextReps,
    intervalDays: nextInterval,
    dueAt: addDays(nextInterval),
  };
}

export function scoreAccuracy(correct: number, total: number): number {
  if (total <= 0) return 0;
  return Number(((correct / total) * 100).toFixed(2));
}

export function adaptiveDifficulty(accuracy: number): "easy" | "normal" | "hard" {
  if (accuracy >= 85) return "hard";
  if (accuracy < 60) return "easy";
  return "normal";
}

export function generateStudyPlan(input: {
  level: "beginner" | "exposed";
  dailyMinutes: number;
  goal: "exam" | "conversation";
}): string {
  const baseBlocks = [
    "5m habit warmup (kana recall)",
    "10m active recall quiz",
    "10m mixed review (interleaving)",
    "5m mistake notebook revisit",
  ];

  const flexible = input.dailyMinutes > 35
    ? ["10m listening game", "10m speaking prompt", "10m graded reading"]
    : ["8m listening", "8m speaking", "8m reading"];

  const goalBlock =
    input.goal === "exam"
      ? "Finish with JLPT-style mini test section"
      : "Finish with guided conversation role-play";

  return [...baseBlocks, ...flexible, goalBlock].join(" | ");
}

export function pronunciationFeedback(expected: string, transcript: string) {
  const expectedTokens = normalize(expected).split(" ").filter(Boolean);
  const heardTokens = normalize(transcript).split(" ").filter(Boolean);
  const missing = expectedTokens.filter((token) => !heardTokens.includes(token));
  const matched = expectedTokens.length - missing.length;
  const quality = Math.max(0, Math.min(100, Math.round((matched / Math.max(1, expectedTokens.length)) * 100)));

  return {
    quality,
    missingWords: missing,
    feedback:
      missing.length === 0
        ? "Great! Try smoother pacing and clearer particles for native-like rhythm."
        : `Missing words: ${missing.join(", ")}. Focus on particles like は/を/に and speak in short chunks.`,
  };
}

export function buildInterleavingQueue(skills: string[], maxItems = 12): string[] {
  const queue: string[] = [];
  for (let i = 0; i < maxItems; i += 1) {
    queue.push(skills[i % skills.length]);
  }
  return queue;
}

function addDays(days: number): Date {
  const now = new Date();
  now.setDate(now.getDate() + days);
  return now;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[。、,.!?]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
