import { strictEqual } from "node:assert";
import { it } from "node:test";
import { Sugar } from "../index";

export function testFindIndexSerial(ai: Sugar, verbose?: boolean) {
  const array = ["goat", "fish", "monkey", "cat", "dog", "chicken", "lion"];
  if (verbose) console.log("animals:", array);

  it("findIndexSerial", async () => {
    const condition1 = "is a bird";
    const result1 = await ai.findIndexSerial({
      array,
      prompt: condition1,
    });
    strictEqual(result1, 5);

    const condition2 = "meows and purrs";
    const result2 = await ai.findIndexSerial({
      array,
      prompt: condition2,
    });
    strictEqual(result2, 3);
  });
}

export function testFindIndexConcurrent(ai: Sugar, verbose?: boolean) {
  const array = ["goat", "fish", "monkey", "cat", "dog", "chicken", "lion"];
  if (verbose) console.log("animals:", array);

  it("findIndexConcurrent", async () => {
    const condition1 = "is a bird";
    const result1 = await ai.findIndexConcurrent({
      array,
      prompt: condition1,
    });
    strictEqual(result1, 5);

    const condition2 = "meows and purrs";
    const result2 = await ai.findIndexConcurrent({
      array,
      prompt: condition2,
    });
    strictEqual(result2, 3);
  });
}

export function testFindIndexGenerate(ai: Sugar, verbose?: boolean) {
  const array = ["goat", "fish", "monkey", "cat", "dog", "chicken", "lion"];
  if (verbose) console.log("animals:", array);

  it("findIndexGenerate", async () => {
    const condition1 = "is a bird";
    const result1 = await ai.findIndexGenerate({
      array,
      prompt: condition1,
    });
    strictEqual(result1, 5);

    const condition2 = "meows and purrs";
    const result2 = await ai.findIndexGenerate({
      array,
      prompt: condition2,
    });
    strictEqual(result2, 3);
  });
}
