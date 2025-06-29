import { generateObject, generateText, LanguageModel } from "ai";
import { isDeepStrictEqual } from "node:util";
import z from "zod";

// type GenerateText = Parameters<typeof generateText>["0"];
// type GenerateObject = Parameters<typeof generateObject>["0"];

type Global = {
  model: LanguageModel;
  maxTokens?: number;
  maxRetries?: number;
  // systemPrompts?: Partial<Record<keyof Sugar, string>>;
  // randomize?: boolean;
  // cycle?: boolean;
  // alternate?: boolean;
  // retryWithAlternate?: number;
};

type Prompt = {
  prompt: string;
};

type Local = {
  // system?: string;
  model?: LanguageModel;
  maxTokens?: number;
  maxRetries?: number;
};

const merge = (global: Global, local: Local) => ({
  ...global,
  ...local,
});

// reprompt
// paraphrase
// steps
// conditions

export function sugar(options: Global) {
  async function shortAnswer({ prompt, ...rest }: Prompt & Local) {
    const { text } = await generateText({
      system: "respond with extremely short and concise answers only",
      prompt: JSON.stringify({ question: prompt }),
      ...merge(options, rest),
    });
    return text;
  }

  async function complete({ prompt, ...rest }: Prompt & Local) {
    const { text } = await generateText({
      system:
        "complete the sentence using the prompt to match what is most likely expected",
      prompt,
      ...merge(options, rest),
    });
    return text;
  }

  async function isTrue({ prompt, ...rest }: { prompt: string } & Local) {
    const { object } = await generateObject({
      system: "is this statement true or false?",
      // is this a valid proposition?
      // return "true" or "false" after evaluating the statement
      //  evaluate the statement as either true or false
      prompt: JSON.stringify({ prompt }),
      schema: z.object({
        boolean: z.boolean(),
      }),
      ...merge(options, rest),
    });
    return object.boolean;
  }

  async function knows({ prompt, ...rest }: Prompt & Local) {
    const { object } = await generateObject({
      system:
        "is this something that you know? as of the current date provided",
      prompt: JSON.stringify({ prompt, date: new Date().toISOString() }),
      schema: z.object({
        boolean: z.boolean(),
      }),
      ...merge(options, rest),
    });
    return object.boolean;
  }

  async function can({ prompt, ...rest }: Prompt & Local) {
    const { object } = await generateObject({
      system: "is this something that you can do?",
      prompt: JSON.stringify({ prompt }),
      schema: z.object({
        boolean: z.boolean(),
      }),
      ...merge(options, rest),
    });
    return object.boolean;
  }

  async function isCondition({ prompt, ...rest }: Prompt & Local) {
    const { object } = await generateObject({
      system:
        "is this a valid condition that can either be true or false when evaluated? do not evaluate the condition itself as true or false",
      prompt: JSON.stringify({ prompt }),
      schema: z.object({
        boolean: z.boolean(),
      }),
      ...merge(options, rest),
    });
    return object.boolean;
  }

  async function isOrder({ prompt, ...rest }: Prompt & Local) {
    const { object } = await generateObject({
      system:
        "is this a valid description to sort things into a specific order?",
      // is this a valid description that can be used to order things?
      // is this a valid comparison/order description?
      // is this a description that can be used to order items?
      // "can this description be used to order things?"
      prompt: JSON.stringify({ prompt }),
      schema: z.object({
        boolean: z.boolean(),
      }),
      ...merge(options, rest),
    });
    return object.boolean;
  }

  async function createObject({
    prompt,
    schema,
    ...rest
  }: {
    prompt: string;
    schema: z.ZodSchema;
  } & Local) {
    const { object } = await generateObject({
      system: "create an object using the prompt that matches the schema",
      prompt,
      schema,
      ...merge(options, rest),
    });
    return object;
  }

  async function createArray({
    prompt,
    schema,
    ...rest
  }: {
    prompt: string;
    schema: z.ZodSchema;
  } & Local) {
    const { object } = await generateObject({
      system: "create an array using the prompt that matches the schema",
      prompt,
      schema,
      output: "array",
      ...merge(options, rest),
    });
    return object;
  }

  async function isTrueValue<T>({
    value,
    prompt,
    ...rest
  }: {
    value: T;
    prompt: string;
  } & Local) {
    const { object } = await generateObject({
      system: `return "true" or "false" after evaluating the "condition" on the "value"`,
      prompt: JSON.stringify({ value, condition: prompt }),
      schema: z.object({
        boolean: z.boolean(),
      }),
      ...merge(options, rest),
    });
    return object.boolean;
  }

  async function isTrueArray<T>({
    array,
    prompt,
    ...rest
  }: {
    array: T[];
    prompt: string;
  } & Local) {
    const { object } = await generateObject({
      system: `return an array of "true" or "false" after applying the "condition" to each item in the "array"`,
      prompt: JSON.stringify({ array, condition: prompt }),
      schema: z.boolean(),
      output: "array",
      ...merge(options, rest),
    });
    if (object.length !== array.length) {
      throw new Error("something went wrong");
    }
    return object;
  }

  async function everySerial<T>({
    array,
    prompt,
    ...rest
  }: {
    array: T[];
    prompt: string;
  } & Local) {
    for (const item of array) {
      if (!(await isTrueValue({ value: item, prompt, ...rest }))) {
        return false;
      }
    }
    return true;
  }

  async function everyConcurrent<T>({
    array,
    prompt,
    ...rest
  }: {
    array: T[];
    prompt: string;
  }) {
    const booleans = await isTrueArray({ array, prompt, ...rest });
    // const result = booleans.every((b) => b);
    const result = array.every((_, index) => booleans[index]);
    return result;
  }

  async function everyGenerate<T>({
    array,
    prompt,
    ...rest
  }: {
    array: T[];
    prompt: string;
  } & Local) {
    const { object } = await generateObject({
      system: `return "true" only if all items in the "array" match the "condition", otherwise return "false"`,
      prompt: JSON.stringify({ array, condition: prompt }),
      schema: z.object({
        boolean: z.boolean(),
      }),
      ...merge(options, rest),
    });
    return object.boolean;
  }

  async function filterSerial<T>({
    array,
    prompt,
    ...rest
  }: {
    array: T[];
    prompt: string;
  } & Local) {
    const result: T[] = [];
    for (const item of array) {
      if (await isTrueValue({ value: item, prompt, ...rest })) {
        result.push(item);
      }
    }
    return result;
  }

  async function filterConcurrent<T>({
    array,
    prompt,
    ...rest
  }: {
    array: T[];
    prompt: string;
  } & Local) {
    const booleans = await isTrueArray({ array, prompt, ...rest });
    const result = array.filter((_, index) => booleans[index]);
    return result;
  }

  async function filterGenerate<T>({
    array,
    prompt,
    schema,
    ...rest
  }: {
    array: T[];
    prompt: string;
    schema: z.ZodSchema<T>;
  } & Local) {
    const { object } = await generateObject({
      system: `filter the "array" to return only the items that match the "condition"`,
      prompt: JSON.stringify({ array, condition: prompt }),
      schema,
      output: "array",
      ...merge(options, rest),
    });
    if (
      !object.every((item) => array.some((a) => isDeepStrictEqual(item, a)))
    ) {
      throw new Error("something went wrong");
    }
    return object;
  }

  async function findSerial<T>({
    array,
    prompt,
    ...rest
  }: {
    array: T[];
    prompt: string;
  } & Local) {
    for (const item of array) {
      if (await isTrueValue({ value: item, prompt, ...rest })) {
        return item;
      }
    }
    return undefined;
  }

  async function findConcurrent<T>({
    array,
    prompt,
    ...rest
  }: {
    array: T[];
    prompt: string;
  } & Local) {
    const booleans = await isTrueArray({ array, prompt, ...rest });
    const result = array.find((_, index) => booleans[index]);
    return result;
  }

  async function findGenerate<T>({
    array,
    prompt,
    schema,
    ...rest
  }: {
    array: T[];
    prompt: string;
    schema: z.ZodSchema<T>;
  } & Local) {
    const { object } = await generateObject({
      system: `return the first item in the "array" that matches the "condition", otherwise return the string "undefined"`,
      prompt: JSON.stringify({ array, condition: prompt }),
      schema: z.object({
        value: schema,
      }),
      ...merge(options, rest),
    });
    const { value } = object;
    if (value) {
      if (value === "undefined") {
        return undefined;
      }
      if (!array.some((a) => isDeepStrictEqual(value, a))) {
        throw new Error("something went wrong");
      }
    }
    return value;
  }

  async function findIndexSerial({
    array,
    prompt,
    ...rest
  }: {
    array: any[];
    prompt: string;
  } & Local) {
    for (let i = 0; i < array.length; i++) {
      if (await isTrueValue({ value: array[i], prompt, ...rest })) {
        return i;
      }
    }
    return -1;
  }

  async function findIndexConcurrent<T>({
    array,
    prompt,
    ...rest
  }: {
    array: T[];
    prompt: string;
  } & Local) {
    const booleans = await isTrueArray({ array, prompt, ...rest });
    // const result = booleans.findIndex((b) => b);
    const result = array.findIndex((_, index) => booleans[index]);
    return result;
  }

  async function findIndexGenerate<T>({
    array,
    prompt,
    ...rest
  }: {
    array: T[];
    prompt: string;
  } & Local) {
    const { object } = await generateObject({
      system: `return the index of the first item in the "array" that matches the "condition", otherwise return "-1"`,
      prompt: JSON.stringify({ array, condition: prompt }),
      schema: z.object({
        number: z.number(),
      }),
      ...merge(options, rest),
    });
    return object.number;
  }

  async function someSerial<T>({
    array,
    prompt,
    ...rest
  }: {
    array: T[];
    prompt: string;
  } & Local) {
    for (const item of array) {
      if (await isTrueValue({ value: item, prompt, ...rest })) {
        return true;
      }
    }
    return false;
  }

  async function someConcurrent<T>({
    array,
    prompt,
    ...rest
  }: {
    array: T[];
    prompt: string;
  } & Local) {
    const booleans = await isTrueArray({ array, prompt });
    // const result = booleans.some((b) => b);
    const result = array.some((_, index) => booleans[index]);
    return result;
  }

  async function someGenerate<T>({
    array,
    prompt,
    ...rest
  }: {
    array: T[];
    prompt: string;
  } & Local) {
    const { object } = await generateObject({
      system: `return "true" only if one or more items in the "array" matches the "condition", otherwise return "false"`,
      prompt: JSON.stringify({ array, condition: prompt }),
      schema: z.object({
        boolean: z.boolean(),
      }),
      ...merge(options, rest),
    });
    return object.boolean;
  }

  async function toSortedGenerate<T>({
    array,
    prompt,
    schema,
    ...rest
  }: {
    array: T[];
    prompt: string;
    schema: z.ZodSchema<T>;
  } & Local) {
    const { object } = await generateObject({
      system: `sort the "array" in the "order" specified`,
      prompt: JSON.stringify({ array, order: prompt }),
      schema,
      output: "array",
      ...merge(options, rest),
    });
    const filtered = object.filter((item) =>
      array.some((a) => isDeepStrictEqual(item, a))
    );
    if (filtered.length !== array.length) {
      throw new Error("something went wrong");
    }
    return object;
  }

  return {
    shortAnswer,
    complete,
    isTrue,
    knows,
    can,
    isCondition,
    isOrder,
    createObject,
    createText: shortAnswer,
    createArray,
    isTrueValue,
    isTrueArray,
    everySerial,
    everyConcurrent,
    everyGenerate,
    every: everyConcurrent,
    filterSerial,
    filterConcurrent,
    filterGenerate,
    filter: filterConcurrent,
    findSerial,
    findConcurrent,
    findGenerate,
    find: findConcurrent,
    findIndexSerial,
    findIndexConcurrent,
    findIndexGenerate,
    findIndex: findIndexConcurrent,
    someSerial,
    someConcurrent,
    someGenerate,
    some: someConcurrent,
    toSortedGenerate,
    sort: toSortedGenerate,
    toSorted: toSortedGenerate,
  };
}

export type Sugar = ReturnType<typeof sugar>;
