import { deepStrictEqual, strictEqual } from "node:assert";
import { it } from "node:test";
import { z } from "zod";
import { Sugar } from "../ai";

function isEqual(result: string[], required: string[]) {
  for (const item of required) {
    if (!result.includes(item)) {
      return false;
    }
  }
  return true;
}

export function testFilterSerial(ai: Sugar, verbose?: boolean) {
  const array = ["goat", "fish", "monkey", "cat", "dog", "chicken", "lion"];
  if (verbose) console.log("animals:", array);

  it("filterSerial", async () => {
    const condition1 = "is not a mammal";
    const result1 = await ai.filterSerial({ array, prompt: condition1 });
    deepStrictEqual(result1, ["fish", "chicken"]);

    const condition2 = "is a domestic animal";
    const result2 = await ai.filterSerial({ array, prompt: condition2 });
    console.log(condition2, result2);
    strictEqual(isEqual(result2, ["cat", "dog"]), true);

    const condition3 = "is a wild animal";
    const result3 = await ai.filterSerial({ array, prompt: condition3 });
    console.log(condition3, result3);
    strictEqual(isEqual(result3, ["monkey", "lion"]), true);

    const colors = ["red", "white", "green", "blue", "yellow", "black"];
    if (verbose) console.log("colors:", colors);

    const condition4 = "is a rainbow color";
    const result4 = await ai.filterSerial({
      array: colors,
      prompt: condition4,
    });
    deepStrictEqual(result4, ["red", "green", "blue", "yellow"]);
  });
}

export function testFilterConcurrent(ai: Sugar, verbose?: boolean) {
  const array = ["goat", "fish", "monkey", "cat", "dog", "chicken", "lion"];
  if (verbose) console.log("animals:", array);

  it("filterConcurrent", async () => {
    const condition1 = "is not a mammal";
    const result1 = await ai.filterConcurrent({ array, prompt: condition1 });
    deepStrictEqual(result1, ["fish", "chicken"]);

    const condition2 = "is a domestic animal";
    const result2 = await ai.filterConcurrent({ array, prompt: condition2 });
    console.log(condition2, result2);
    strictEqual(isEqual(result2, ["cat", "dog"]), true);

    const condition3 = "is a wild animal";
    const result3 = await ai.filterConcurrent({ array, prompt: condition3 });
    console.log(condition3, result3);
    strictEqual(isEqual(result3, ["monkey", "lion"]), true);

    const colors = ["red", "white", "green", "blue", "yellow", "black"];
    if (verbose) console.log("colors:", colors);

    const condition4 = "is a rainbow color";
    const result4 = await ai.filterConcurrent({
      array: colors,
      prompt: condition4,
    });
    deepStrictEqual(result4, ["red", "green", "blue", "yellow"]);
  });
}

export function testFilterGenerate(ai: Sugar, verbose?: boolean) {
  const array = ["goat", "fish", "monkey", "cat", "dog", "chicken", "lion"];
  if (verbose) console.log("animals:", array);

  it("filterGenerate", async () => {
    const schema = z.string();
    const condition1 = "is not a mammal";
    const result1 = await ai.filterGenerate({
      array,
      prompt: condition1,
      schema,
    });
    deepStrictEqual(result1, ["fish", "chicken"]);

    const condition2 = "is a domestic animal";
    const result2 = await ai.filterGenerate({
      array,
      prompt: condition2,
      schema,
    });
    console.log(condition2, result2);
    strictEqual(isEqual(result2, ["cat", "dog"]), true);

    const condition3 = "is a wild animal";
    const result3 = await ai.filterGenerate({
      array,
      prompt: condition3,
      schema,
    });
    console.log(condition3, result3);
    strictEqual(isEqual(result3, ["monkey", "lion"]), true);

    const colors = ["red", "white", "green", "blue", "yellow", "black"];
    if (verbose) console.log("colors:", colors);

    const condition4 = "is a rainbow color";
    const result4 = await ai.filterGenerate({
      array: colors,
      prompt: condition4,
      schema,
    });
    deepStrictEqual(result4, ["red", "green", "blue", "yellow"]);
  });
}
