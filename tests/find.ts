import { strictEqual } from "node:assert";
import { it } from "node:test";
import { z } from "zod";
import { Sugar } from "../src/index";

export function testFindSerial(ai: Sugar, verbose?: boolean) {
  const array = ["goat", "fish", "monkey", "cat", "dog", "chicken", "lion"];
  if (verbose) console.log("animals:", array);

  it("findSerial", async () => {
    const condition1 = "lives in water";
    const result1 = await ai.findSerial({
      array,
      condition: condition1,
    });
    strictEqual(result1, "fish");

    const condition2 = "meows and purrs";
    const result2 = await ai.findSerial({
      array,
      condition: condition2,
    });
    strictEqual(result2, "cat");
  });
}

export function testFindConcurrent(ai: Sugar, verbose?: boolean) {
  const array = ["goat", "fish", "monkey", "cat", "dog", "chicken", "lion"];
  if (verbose) console.log("animals:", array);

  it("findConcurrent", async () => {
    const condition1 = "lives in water";
    const result1 = await ai.findConcurrent({
      array,
      condition: condition1,
    });
    strictEqual(result1, "fish");

    const condition2 = "meows and purrs";
    const result2 = await ai.findConcurrent({
      array,
      condition: condition2,
    });
    strictEqual(result2, "cat");
  });
}

export function testFindGenerate(ai: Sugar, verbose?: boolean) {
  const array = ["goat", "fish", "monkey", "cat", "dog", "chicken", "lion"];
  if (verbose) console.log("animals:", array);

  it("findGenerate", async () => {
    const schema = z.string();

    const condition1 = "lives in water";
    const result1 = await ai.findGenerate({
      array,
      condition: condition1,
      schema,
    });
    strictEqual(result1, "fish");

    const condition2 = "meows and purrs";
    const result2 = await ai.findGenerate({
      array,
      condition: condition2,
      schema,
    });
    strictEqual(result2, "cat");
  });
}
