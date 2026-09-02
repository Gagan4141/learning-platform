import { generateStudyPlan } from "@/lib/learning";

export type OnboardingInput = {
  level: "beginner" | "exposed";
  dailyMinutes: number;
  goal: "exam" | "conversation";
};

export function buildOnboardingProfile(input: OnboardingInput) {
  const weakSkills = input.level === "beginner" ? ["speaking", "listening", "kanji"] : ["grammar", "speaking"];

  return {
    ...input,
    studyPlan: generateStudyPlan(input),
    weakSkills,
    badges: ["N5 Starter", input.goal === "exam" ? "Exam Focus" : "Conversation Focus"],
  };
}
