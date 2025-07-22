import { generateObject, generateText, LanguageModel } from "ai";

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
  // language?: string;
  context?: string;
  // streamText?: boolean;
  // returnEverything?: boolean;
};

export type Global = Shared & {
  model: LanguageModel;
  // globalContext?: unknown;
  // systemPrompts?: Partial<Record<keyof Sugar, string>>;
  // randomize?: boolean;
  // cycle?: boolean;
  // alternate?: boolean;
  // retryWithAlternate?: number;
  // allowRetry?: boolean;
  // sessionId?: string;
  // sessionHistory?: unknown;
};

// export type Prompt = {
//   prompt: string;
//   messages?: GenerateTextInput["messages"];
// };

export type Local = Shared & {
  // system?: string;
  model?: LanguageModel;
  // localContext?: unknown;
  // retry?: boolean;
  // vary?: boolean;
};
