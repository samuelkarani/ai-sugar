import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { openai } from "@ai-sdk/openai";
import { generateText, tool } from "ai";
import Exa from "exa-js";
import z from "zod";
import { sugar } from "./ai";

const exa = new Exa(process.env.EXA_API_KEY);
const model = openai("gpt-4o");
const prompt = "What happened in San Francisco last week?";

async function searchExa(query: string) {
  const { results } = await exa.searchAndContents(query, {
    livecrawl: "always",
    numResults: 3,
  });
  console.log("search results:", results.length);
  return results.map((result) => ({
    title: result.title,
    url: result.url,
    content: result.text.slice(0, 1000),
    publishedDate: result.publishedDate,
  }));
}

async function exaTool() {
  console.log("exa tool");
  // 20.196s
  // often returns { text: '', sources: [] } despite tool being called
  const { text, sources, toolCalls, toolResults } = await generateText({
    model,
    prompt: prompt,
    tools: {
      // each tool comes with a management and "orchestration" cost
      webSearch: tool({
        description: "Search the web for up-to-date information", // more prompting
        parameters: z.object({
          query: z.string().min(1).max(100).describe("The search query"), // could be paraphrased
        }),
        execute: async ({ query }) => {
          console.log("query:", query);
          return searchExa(query); // could be called multiple times
        },
      }),
    },
    maxSteps: 3, // requires guessing/approximating
    toolChoice: "required", // could still be ignored
  });
  console.log("tool calls:", toolCalls.length);
  console.log("tool results:", toolResults.length);
  return { text, sources };
}

async function exaCustom() {
  console.log("exa custom");
  const ai = sugar({ model });
  // 8.899s
  // { text: 'Last week in San Francisco, two major events took place. Firstly, ...', sources: [] }
  if (await ai.knows({ prompt: prompt })) {
    const { text, sources } = await generateText({
      model,
      prompt: prompt,
    });
    return { text, sources };
  } else {
    const results = await searchExa(prompt);
    const { text, sources } = await generateText({
      model,
      system: prompt + " Use the information provided",
      prompt: JSON.stringify(results),
    });
    return { text, sources };
  }
}

async function test() {
  console.time("exa tool");
  const result = await exaTool();
  console.log(result);
  console.timeEnd("exa tool");

  console.time("exa custom");
  const result2 = await exaCustom();
  console.log(result2);
  console.timeEnd("exa custom");
}

test();
