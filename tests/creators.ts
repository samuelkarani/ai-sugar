import { it } from "node:test";
import { z } from "zod";
import { Sugar } from "../src/index";

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

    const prompt3 = "Top 10 countries by population";
    const schema3 = z.object({
      name: z.string(),
      population: z.number(),
      code: z.string(),
    });
    const result3 = await ai.createArray({
      prompt: prompt3,
      schema: schema3,
    });
    console.log(prompt3, result3);

    const prompt4 = "Top AI companies";
    const schema4 = z.object({
      name: z.string(),
      ceo: z.string(),
      products: z.array(z.string()),
    });
    const result4 = await ai.createArray({
      prompt: prompt4,
      schema: schema4,
      length: 3,
    });
    console.log(prompt4, result4);
  });
}
