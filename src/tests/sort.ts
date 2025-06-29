import { deepStrictEqual } from "node:assert";
import { it } from "node:test";
import { z } from "zod";
import { Sugar } from "../ai";

export function testToSortedGenerate(ai: Sugar, verbose?: boolean) {
  it("toSortedGenerate", async () => {
    const colors = ["green", "red", "blue", "yellow"];
    if (verbose) console.log("colors:", colors);

    const result1 = await ai.toSortedGenerate({
      array: colors,
      prompt: "rainbow color order",
      schema: z.string(),
    });
    deepStrictEqual(result1, ["red", "yellow", "green", "blue"]);

    const presidents = ["obama", "reagan", "clinton", "biden"];
    if (verbose) console.log("presidents:", presidents);

    const result2 = await ai.toSortedGenerate({
      array: presidents,
      prompt: "most recent first",
      schema: z.string(),
    });
    deepStrictEqual(result2, ["biden", "obama", "clinton", "reagan"]);

    const numbers = ["forty two", "55", "seven", "0", "sixteen"];
    if (verbose) console.log("numbers:", numbers);

    const result3 = await ai.toSortedGenerate({
      array: numbers,
      prompt: "largest to smallest",
      schema: z.string(),
    });
    deepStrictEqual(result3, ["55", "forty two", "sixteen", "seven", "0"]);

    const result4 = await ai.toSortedGenerate({
      array: numbers,
      prompt: "smallest to largest",
      schema: z.string(),
    });
    deepStrictEqual(result4, ["0", "seven", "sixteen", "forty two", "55"]);

    const objects = [
      {
        name: "obama",
        age: 44,
      },
      {
        name: "reagan",
        age: 67,
      },
      {
        name: "clinton",
        age: 42,
      },
      {
        name: "biden",
        age: 73,
      },
    ];
    if (verbose) console.log("objects:", objects);

    const result5 = await ai.toSortedGenerate({
      array: objects,
      prompt: "oldest to youngest",
      schema: z.object({
        name: z.string(),
        age: z.number(),
      }),
    });
    deepStrictEqual(result5, [
      { age: 73, name: "biden" },
      { age: 67, name: "reagan" },
      { age: 44, name: "obama" },
      { age: 42, name: "clinton" },
    ]);

    const result6 = await ai.toSortedGenerate({
      array: objects,
      prompt: "youngest to oldest",
      schema: z.object({
        name: z.string(),
        age: z.number(),
      }),
    });
    deepStrictEqual(result6, [
      { age: 42, name: "clinton" },
      { age: 44, name: "obama" },
      { age: 67, name: "reagan" },
      { age: 73, name: "biden" },
    ]);
  });
}
