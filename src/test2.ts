import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { openai } from "@ai-sdk/openai";
import { generateText, tool } from "ai";
import Exa from "exa-js";
import { z } from "zod";
import { sugar } from "./ai";

const exa = new Exa(process.env.EXA_API_KEY);
const model = openai("gpt-4o");
const prompt = "who is the current president of the united states?";

async function rawPrompt() {
  console.log("raw prompt");
  // 9.439s
  // in my testing, despite tool being called, returns empty text and no sources
  const { text, sources } = await generateText({
    model,
    prompt: prompt,
    tools: {
      // web_search_preview: openai.tools.webSearchPreview(), // not called in my testing ??
      webSearch: tool({
        description: "Search the web for up-to-date information",
        parameters: z.object({
          query: z.string().min(1).max(100).describe("The search query"),
        }),
        execute: async ({ query }: { query: string }) => {
          console.log("query:", query);
          // some of the queries from testing
          // query: current president of the United States 2023
          // query: current president of the United States
          // query: current president of the United States 2023
          const { answer, citations } = await exa.answer(query); // web search grounding api
          return { text: answer, sources: citations.length };
        },
      }),
    },
    maxSteps: 3,
    toolChoice: "required",
  });
  return { text, sources: sources.length };
}

async function customPrompt() {
  console.log("custom prompt");
  const ai = sugar({ model });
  //  2.455s
  // { text: 'Donald J. Trump is the current president of the United States...', sources: 8 }
  if (await ai.knows({ prompt: prompt })) {
    const { text, sources } = await generateText({
      model,
      prompt: prompt,
    });
    return { text, sources: sources.length };
  } else {
    const { answer, citations } = await exa.answer(prompt); // web search grounding api
    return { text: answer, sources: citations.length };
  }
}

async function test() {
  console.time("raw prompt");
  const result = await rawPrompt();
  console.log(result);
  console.timeEnd("raw prompt");

  console.time("custom prompt");
  const result2 = await customPrompt();
  console.log(result2);
  console.timeEnd("custom prompt");
}

test();
