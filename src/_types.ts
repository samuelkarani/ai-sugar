import { generateObject, generateText, type LanguageModel } from "ai";

export type GenerateTextInput = Parameters<typeof generateText>["0"];
export type GenerateObjectInput = Parameters<typeof generateObject>["0"];

type GenerateTextOutput = ReturnType<typeof generateText>;
type GenerateObjectOutput = ReturnType<typeof generateObject>;

type Input = string | Record<string, unknown> | unknown[];

type TextMessages = GenerateTextInput["messages"];
type ObjectMessages = GenerateObjectInput["messages"];

type Shared = {
  // vercel
  // messages?: TextMessages | ObjectMessages;
  maxTokens?: GenerateTextInput["maxTokens"];
  temperature?: GenerateTextInput["temperature"];
  topP?: GenerateTextInput["topP"];
  topK?: GenerateTextInput["topK"];
  maxRetries?: GenerateTextInput["maxRetries"];
  abortSignal?: GenerateTextInput["abortSignal"];
  //custom
  responseLanguage?: string;
  context?: string;
  autoContext?: boolean; // add function responses to (user) context
  streamText?: boolean;
  returnEverything?: boolean;
};

type User = {
  id: string;
  data?: unknown;
  language?: string;
  summary?: string;
};

export type Global = Shared & {
  model: LanguageModel;
  models?: LanguageModel[];
  globalContext?: unknown;
  selectModels?: "all" | "random" | "cycle";
  selectPrompts?: "all" | "random" | "cycle";
  // alternate?: boolean;
  // sessionId?: string;
  // sessionHistory?: unknown;
};

export type Local = Shared & {
  model?: LanguageModel;
  models?: LanguageModel[];
  localContext?: unknown;
  prompt?: string;
  prompts?: string[];
  messages?: GenerateTextInput["messages"];
  match?: Record<string, LanguageModel>;
  // retry?: boolean;
  // vary?: boolean;
};
