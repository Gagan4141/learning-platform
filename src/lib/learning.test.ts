import { describe, expect, it } from "vitest";
import { adaptiveDifficulty, buildInterleavingQueue, generateStudyPlan, pronunciationFeedback, scheduleSrsReview } from "./learning";

describe("SRS scheduling", () => {
  it("resets interval for low grade", () => {
    const result = scheduleSrsReview(2.5, 3, 7, 1);
    expect(result.repetitions).toBe(0);
    expect(result.intervalDays).toBe(1);
  });

  it("expands interval on strong recall", () => {
    const result = scheduleSrsReview(2.5, 3, 7, 5);
    expect(result.repetitions).toBe(4);
    expect(result.intervalDays).toBeGreaterThan(7);
  });
});

describe("progression and scoring", () => {
  it("returns adaptive mode based on score", () => {
    expect(adaptiveDifficulty(40)).toBe("easy");
    expect(adaptiveDifficulty(70)).toBe("normal");
    expect(adaptiveDifficulty(92)).toBe("hard");
  });

  it("creates interleaving queue", () => {
    const queue = buildInterleavingQueue(["reading", "listening", "speaking"], 7);
    expect(queue).toEqual(["reading", "listening", "speaking", "reading", "listening", "speaking", "reading"]);
  });

  it("builds a personalized plan", () => {
    const plan = generateStudyPlan({ level: "beginner", dailyMinutes: 45, goal: "exam" });
    expect(plan).toContain("active recall");
    expect(plan).toContain("JLPT-style");
  });
});

describe("speaking feedback", () => {
  it("reports missing words", () => {
    const result = pronunciationFeedback("watashi wa gakusei desu", "watashi gakusei");
    expect(result.quality).toBeLessThan(100);
    expect(result.missingWords).toContain("wa");
  });
});
