import seedContent from "../../prisma/seed-content/n5-content.json";

export type Lesson = {
  id: string;
  skill: string;
  unit: number;
  title: string;
  objective: string;
  examples: string[];
  quiz: { question: string; answer: string }[];
  masteryCriteria: { minScore: number; minAttempts: number };
};

export const n5Content = seedContent;

export const skillOrder = [
  "hiragana",
  "katakana",
  "kanji",
  "vocabulary",
  "grammar",
  "reading",
  "listening",
  "speaking",
  "writing",
] as const;

export function getLessonsBySkill(skill: string): Lesson[] {
  return n5Content.lessons.filter((lesson) => lesson.skill === skill) as Lesson[];
}
