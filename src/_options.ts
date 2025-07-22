import { openai } from "@ai-sdk/openai";
import { generateObject, generateText } from "ai";
import {
  GenerateObjectInput,
  GenerateTextInput,
  Global,
  Local,
} from "./_types";

export let _global: Global = {
  model: openai("gpt-4o-mini"),
};

export let _retAll = false;

export const merge = (global: Global, local: Local) => ({
  ...global,
  ...local,
});

export const merge2 = (local: Local) => ({
  ..._global,
  ...local,
});

export async function text(args: GenerateTextInput) {
  const result = await generateText(args);
  if (_retAll) return result;
  return result.text;
}

export async function object(args: GenerateObjectInput) {
  const result = await generateObject(args);
  if (_retAll) return result;
  return result.object;
}
