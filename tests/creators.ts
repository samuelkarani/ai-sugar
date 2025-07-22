import { it } from "node:test";
import { z } from "zod";
import { Sugar } from "../src/index";

export function testCreateText(ai: Sugar) {
  it("createText", async () => {
    const question1 = "who is the president of kenya?"; // shortAnswer
    const result1 = await ai.createText({ question: question1 });
    console.log(question1, result1);

    const question2 = "what's a good name for a dog"; // name
    const result2 = await ai.createText({ question: question2 });
    console.log(question2, result2);
  });
}

export function testCreateObject(ai: Sugar) {
  it("createObject", async () => {
    const description1 = "a popular book";
    const schema1 = z.object({
      title: z.string(),
      author: z.string(),
      genre: z.string(),
    });
    const result1 = await ai.createObject({
      description: description1,
      schema: schema1,
    });
    console.log(description1, result1);

    const description2 = "best russian authors";
    const schema2 = z.object({
      authors: z.array(z.string()),
    });
    const result2 = await ai.createObject({
      description: description2,
      schema: schema2,
    });
    console.log(description2, result2);
  });
}

export function testCreateArray(ai: Sugar) {
  it("createArray", async () => {
    const description1 = "best american authors";
    const schema1 = z.string();
    const result1 = await ai.createArray({
      description: description1,
      schema: schema1,
    });
    console.log(description1, result1);

    const description2 = "7 colors of the rainbow";
    const schema2 = z.string();
    const result2 = await ai.createArray({
      description: description2,
      schema: schema2,
    });
    console.log(description2, result2);

    const description3 = "Top 10 countries by population";
    const schema3 = z.object({
      name: z.string(),
      population: z.number(),
      code: z.string(),
    });
    const result3 = await ai.createArray({
      description: description3,
      schema: schema3,
    });
    console.log(description3, result3);

    const description4 = "Top AI companies";
    const schema4 = z.object({
      name: z.string(),
      ceo: z.string(),
      products: z.array(z.string()),
    });
    const result4 = await ai.createArray({
      description: description4,
      schema: schema4,
      length: 3,
    });
    console.log(description4, result4);
  });
}
