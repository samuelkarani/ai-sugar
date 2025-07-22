import { strictEqual } from "assert";
import { it } from "node:test";
import { Sugar } from "../src/index";

export function testEverySerial(ai: Sugar, verbose?: boolean) {
  const array = ["goat", "fish", "monkey", "cat", "dog", "chicken", "lion"];
  if (verbose) console.log("animals:", array);

  it("everySerial", async () => {
    const condition1 = "have four legs";
    const result1 = await ai.everySerial({ array, condition: condition1 });
    strictEqual(result1, false);

    const condition2 = "all are animals";
    const result2 = await ai.everySerial({ array, condition: condition2 });
    strictEqual(result2, true);
  });
}

export function testEveryConcurrent(ai: Sugar, verbose?: boolean) {
  const array = ["goat", "fish", "monkey", "cat", "dog", "chicken", "lion"];
  if (verbose) console.log("animals:", array);

  it("everyConcurrent", async () => {
    const condition1 = "have four legs";
    const result1 = await ai.everyConcurrent({ array, condition: condition1 });
    strictEqual(result1, false);

    const condition2 = "all are animals";
    const result2 = await ai.everyConcurrent({ array, condition: condition2 });
    strictEqual(result2, true);
  });
}

export function testEveryGenerate(ai: Sugar, verbose?: boolean) {
  const array = ["goat", "fish", "monkey", "cat", "dog", "chicken", "lion"];
  if (verbose) console.log("animals:", array);

  it("everyGenerate", async () => {
    const condition1 = "have four legs";
    const result1 = await ai.everyGenerate({ array, condition: condition1 });
    strictEqual(result1, false);

    const condition2 = "all are animals";
    const result2 = await ai.everyGenerate({ array, condition: condition2 });
    strictEqual(result2, true);
  });
}
