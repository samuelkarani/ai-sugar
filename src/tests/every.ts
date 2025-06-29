import { strictEqual } from "assert";
import { it } from "node:test";
import { Sugar } from "../ai";

export function testEverySerial(ai: Sugar, verbose?: boolean) {
  const array = ["goat", "fish", "monkey", "cat", "dog", "chicken", "lion"];
  if (verbose) console.log("animals:", array);

  it("everySerial", async () => {
    const condition1 = "have four legs";
    const result1 = await ai.everySerial({ array, prompt: condition1 });
    strictEqual(result1, false);

    const condition2 = "all are animals";
    const result2 = await ai.everySerial({ array, prompt: condition2 });
    strictEqual(result2, true);
  });
}

export function testEveryConcurrent(ai: Sugar, verbose?: boolean) {
  const array = ["goat", "fish", "monkey", "cat", "dog", "chicken", "lion"];
  if (verbose) console.log("animals:", array);

  it("everyConcurrent", async () => {
    const condition1 = "have four legs";
    const result1 = await ai.everyConcurrent({ array, prompt: condition1 });
    strictEqual(result1, false);

    const condition2 = "all are animals";
    const result2 = await ai.everyConcurrent({ array, prompt: condition2 });
    strictEqual(result2, true);
  });
}

export function testEveryGenerate(ai: Sugar, verbose?: boolean) {
  const array = ["goat", "fish", "monkey", "cat", "dog", "chicken", "lion"];
  if (verbose) console.log("animals:", array);

  it("everyGenerate", async () => {
    const condition1 = "have four legs";
    const result1 = await ai.everyGenerate({ array, prompt: condition1 });
    strictEqual(result1, false);

    const condition2 = "all are animals";
    const result2 = await ai.everyGenerate({ array, prompt: condition2 });
    strictEqual(result2, true);
  });
}
