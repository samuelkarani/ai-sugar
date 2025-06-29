import { it } from "node:test";
import { Sugar } from "../index";

export function testSomeSerial(ai: Sugar, verbose?: boolean) {
  const array = ["goat", "fish", "monkey", "cat", "dog", "chicken", "lion"];
  if (verbose) console.log("animals:", array);

  it("someSerial", async () => {
    const condition1 = "can fly";
    const result1 = await ai.someSerial({ array, prompt: condition1 });
    console.log(condition1, result1);

    const condition2 = "can swim";
    const result2 = await ai.someSerial({ array, prompt: condition2 });
    console.log(condition2, result2);
  });
}

export function testSomeConcurrent(ai: Sugar, verbose?: boolean) {
  const array = ["goat", "fish", "monkey", "cat", "dog", "chicken", "lion"];
  if (verbose) console.log("animals:", array);

  it("someConcurrent", async () => {
    const condition1 = "can fly";
    const result1 = await ai.someConcurrent({ array, prompt: condition1 });
    console.log(condition1, result1);

    const condition2 = "can swim";
    const result2 = await ai.someConcurrent({ array, prompt: condition2 });
    console.log(condition2, result2);
  });
}

export function testSomeGenerate(ai: Sugar, verbose?: boolean) {
  const array = ["goat", "fish", "monkey", "cat", "dog", "chicken", "lion"];
  if (verbose) console.log("animals:", array);

  it("someGenerate", async () => {
    const condition1 = "can fly";
    const result1 = await ai.someGenerate({ array, prompt: condition1 });
    console.log(condition1, result1);

    const condition2 = "can swim";
    const result2 = await ai.someGenerate({ array, prompt: condition2 });
    console.log(condition2, result2);
  });
}
