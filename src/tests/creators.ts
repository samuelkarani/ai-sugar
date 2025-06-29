import { it } from "node:test";
import { z } from "zod";
import { Sugar } from "../ai";

export function testCreateText(ai: Sugar) {
  it("createText", async () => {
    const prompt1 = "who is the president of kenya?";
    const result1 = await ai.createText({ prompt: prompt1 });
    console.log(prompt1, result1);

    const prompt2 = "what's a good name for a dog";
    const result2 = await ai.createText({ prompt: prompt2 });
    console.log(prompt2, result2);
  });
}

export function testCreateObject(ai: Sugar) {
  it("createObject", async () => {
    const prompt1 = "a popular book";
    const schema1 = z.object({
      title: z.string(),
      author: z.string(),
      genre: z.string(),
    });
    const result1 = await ai.createObject({
      prompt: prompt1,
      schema: schema1,
    });
    console.log(prompt1, result1);

    const prompt2 = "best russian authors";
    const schema2 = z.object({
      authors: z.array(z.string()),
    });
    const result2 = await ai.createObject({
      prompt: prompt2,
      schema: schema2,
    });
    console.log(prompt2, result2);
  });
}

export function testCreateArray(ai: Sugar) {
  it("createArray", async () => {
    const prompt1 = "best american authors";
    const schema1 = z.string();
    const result1 = await ai.createArray({
      prompt: prompt1,
      schema: schema1,
    });
    console.log(prompt1, result1);

    const prompt2 = "7 colors of the rainbow";
    const schema2 = z.string();
    const result2 = await ai.createArray({
      prompt: prompt2,
      schema: schema2,
    });
    console.log(prompt2, result2);
  });
}
