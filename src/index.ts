import { generateObject, generateText } from "ai";
import { isDeepStrictEqual } from "util";
import z from "zod";
import { merge } from "./_options.js";
import { type Global, type Local } from "./_types.js";

// startRecordingHistory
// endRecordingHistory
// getHistory

// remember
// startSession
// endSession
// getSession

// create your own prompt

// image => describe => name => while

// reprompt
// paraphrase
// steps
// conditions
// plan
// convert
// format
// present
// synthesize
// address
// extract
// capture

export default function sugar(options: Global) {
  async function shortAnswer({
    question,
    ...rest
  }: { question: string } & Local) {
    const { text } = await generateText({
      system: "respond precisely with an extremely short and concise answer",
      prompt: JSON.stringify({ question }),
      ...merge(options, rest),
    });
    return text;
  }

  async function complete({ sentence, ...rest }: { sentence: string } & Local) {
    const { text } = await generateText({
      system: `complete the "sentence" to match what is most likely expected`,
      prompt: JSON.stringify({ sentence }),
      ...merge(options, rest),
    });
    return text;
  }

  async function isTrue({ statement, ...rest }: { statement: string } & Local) {
    const { object } = await generateObject({
      system: "is this statement true or false?",
      // is this a valid proposition?
      // return "true" or "false" after evaluating the statement
      //  evaluate the statement as either true or false
      prompt: JSON.stringify({ statement }),
      schema: z.object({
        boolean: z.boolean(),
      }),
      ...merge(options, rest),
    });
    return object.boolean;
  }

  async function knows({
    knowable,
    date,
    ...rest
  }: { knowable: string; date?: boolean | Date | string } & Local) {
    if (typeof date === "boolean" && date === true) {
      date = new Date().toISOString();
    }
    const { object } = await generateObject({
      system:
        "is this something that you know?" +
        (date ? "as of the date provided" : ""),
      prompt: JSON.stringify({
        something: knowable,
        date,
      }),
      schema: z.object({
        boolean: z.boolean(),
      }),
      ...merge(options, rest),
    });
    return object.boolean;
  }

  async function can({
    doable,
    date,
    ...rest
  }: { doable: string; date?: boolean | Date | string } & Local) {
    if (typeof date === "boolean" && date === true) {
      date = new Date().toISOString();
    }
    const { object } = await generateObject({
      system:
        "is this something that you can do?" +
        (date ? "as of the date provided" : ""),
      prompt: JSON.stringify({
        prompt: doable,
        date,
      }),
      schema: z.object({
        boolean: z.boolean(),
      }),
      ...merge(options, rest),
    });
    return object.boolean;
  }

  async function isCondition({
    condition,
    ...rest
  }: { condition: string } & Local) {
    const { object } = await generateObject({
      system:
        "is this a valid condition that can either be true or false when evaluated? do not evaluate the condition itself as true or false",
      prompt: JSON.stringify({ condition }),
      schema: z.object({
        boolean: z.boolean(),
      }),
      ...merge(options, rest),
    });
    return object.boolean;
  }

  async function isOrder({ order, ...rest }: { order: string } & Local) {
    const { object } = await generateObject({
      system:
        "is this a valid description to sort things into a specific order?",
      // is this a valid description that can be used to order things?
      // is this a valid comparison/order description?
      // is this a description that can be used to order items?
      // "can this description be used to order things?"
      prompt: order,
      schema: z.object({
        boolean: z.boolean(),
      }),
      ...merge(options, rest),
    });
    return object.boolean;
  }

  async function createObject<T extends Record<string, unknown>>({
    description,
    schema,
    ...rest
  }: {
    description: string;
    schema: z.ZodSchema<T>;
  } & Local) {
    const { object } = await generateObject({
      system: "create an object using the description that matches the schema",
      prompt: JSON.stringify({ description }),
      schema,
      ...merge(options, rest),
    });
    return object;
  }

  async function createArray<T>({
    description,
    schema,
    length,
    ...rest
  }: {
    description: string;
    schema: z.ZodSchema<T>;
    length?: number;
  } & Local) {
    const { object } = await generateObject({
      system:
        "create an array using the description that matches the schema" +
        (length ? ` with a length of ${length}` : ""),
      prompt: JSON.stringify({ description }),
      schema,
      output: "array",
      ...merge(options, rest),
    });
    return object;
  }

  async function isTrueValue<T>({
    value,
    condition,
    ...rest
  }: {
    value: T;
    condition: string;
  } & Local) {
    const { object } = await generateObject({
      system: `return "true" or "false" after evaluating the "condition" on the "value"`,
      prompt: JSON.stringify({ value, condition }),
      schema: z.object({
        boolean: z.boolean(),
      }),
      ...merge(options, rest),
    });
    return object.boolean;
  }

  async function isTrueArray<T>({
    array,
    condition,
    ...rest
  }: {
    array: T[];
    condition: string;
  } & Local) {
    const { object } = await generateObject({
      system: `return an array of "true" or "false" after applying the "condition" to each item in the "array"`,
      prompt: JSON.stringify({ array, condition }),
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
    condition,
    ...rest
  }: {
    array: T[];
    condition: string;
  } & Local) {
    for (const item of array) {
      if (!(await isTrueValue({ value: item, condition, ...rest }))) {
        return false;
      }
    }
    return true;
  }

  async function everyConcurrent<T>({
    array,
    condition,
    ...rest
  }: {
    array: T[];
    condition: string;
  }) {
    const booleans = await isTrueArray({ array, condition, ...rest });
    // const result = booleans.every((b) => b);
    const result = array.every((_, index) => booleans[index]);
    return result;
  }

  async function everyGenerate<T>({
    array,
    condition,
    ...rest
  }: {
    array: T[];
    condition: string;
  } & Local) {
    const { object } = await generateObject({
      system: `return "true" only if all items in the "array" match the "condition", otherwise return "false"`,
      prompt: JSON.stringify({ array, condition }),
      schema: z.object({
        boolean: z.boolean(),
      }),
      ...merge(options, rest),
    });
    return object.boolean;
  }

  async function filterSerial<T>({
    array,
    condition,
    ...rest
  }: {
    array: T[];
    condition: string;
  } & Local) {
    const result: T[] = [];
    for (const item of array) {
      if (await isTrueValue({ value: item, condition, ...rest })) {
        result.push(item);
      }
    }
    return result;
  }

  async function filterConcurrent<T>({
    array,
    condition,
    ...rest
  }: {
    array: T[];
    condition: string;
  } & Local) {
    const booleans = await isTrueArray({ array, condition, ...rest });
    const result = array.filter((_, index) => booleans[index]);
    return result;
  }

  async function filterGenerate<T>({
    array,
    condition,
    schema,
    ...rest
  }: {
    array: T[];
    condition: string;
    schema: z.ZodSchema<T>;
  } & Local) {
    const { object } = await generateObject({
      system: `filter the "array" to return only the items that match the "condition"`,
      prompt: JSON.stringify({ array, condition }),
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
    condition,
    ...rest
  }: {
    array: T[];
    condition: string;
  } & Local) {
    for (const item of array) {
      if (await isTrueValue({ value: item, condition, ...rest })) {
        return item;
      }
    }
    return undefined;
  }

  async function findConcurrent<T>({
    array,
    condition,
    ...rest
  }: {
    array: T[];
    condition: string;
  } & Local) {
    const booleans = await isTrueArray({ array, condition, ...rest });
    const result = array.find((_, index) => booleans[index]);
    return result;
  }

  async function findGenerate<T>({
    array,
    condition,
    schema,
    ...rest
  }: {
    array: T[];
    condition: string;
    schema: z.ZodSchema<T>;
  } & Local) {
    const { object } = await generateObject({
      system: `return the first item in the "array" that matches the "condition", otherwise return the string "undefined"`,
      prompt: JSON.stringify({ array, condition }),
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

  async function findIndexSerial<T>({
    array,
    condition,
    ...rest
  }: {
    array: T[];
    condition: string;
  } & Local) {
    for (let i = 0; i < array.length; i++) {
      if (await isTrueValue({ value: array[i], condition, ...rest })) {
        return i;
      }
    }
    return -1;
  }

  async function findIndexConcurrent<T>({
    array,
    condition,
    ...rest
  }: {
    array: T[];
    condition: string;
  } & Local) {
    const booleans = await isTrueArray({ array, condition, ...rest });
    // const result = booleans.findIndex((b) => b);
    const result = array.findIndex((_, index) => booleans[index]);
    return result;
  }

  async function findIndexGenerate<T>({
    array,
    condition,
    ...rest
  }: {
    array: T[];
    condition: string;
  } & Local) {
    const { object } = await generateObject({
      system: `return the index of the first item in the "array" that matches the "condition", otherwise return "-1"`,
      prompt: JSON.stringify({ array, condition }),
      schema: z.object({
        index: z.number(),
      }),
      ...merge(options, rest),
    });
    return object.index;
  }

  async function someSerial<T>({
    array,
    condition,
    ...rest
  }: {
    array: T[];
    condition: string;
  } & Local) {
    for (const item of array) {
      if (await isTrueValue({ value: item, condition, ...rest })) {
        return true;
      }
    }
    return false;
  }

  async function someConcurrent<T>({
    array,
    condition,
    ...rest
  }: {
    array: T[];
    condition: string;
  } & Local) {
    const booleans = await isTrueArray({ array, condition, ...rest });
    // const result = booleans.some((b) => b);
    const result = array.some((_, index) => booleans[index]);
    return result;
  }

  async function someGenerate<T>({
    array,
    condition,
    ...rest
  }: {
    array: T[];
    condition: string;
  } & Local) {
    const { object } = await generateObject({
      system: `return "true" only if one or more items in the "array" matches the "condition", otherwise return "false"`,
      prompt: JSON.stringify({ array, condition }),
      schema: z.object({
        boolean: z.boolean(),
      }),
      ...merge(options, rest),
    });
    return object.boolean;
  }

  async function toSortedGenerate<T>({
    array,
    order,
    schema,
    ...rest
  }: {
    array: T[];
    order: string;
    schema: z.ZodSchema<T>;
  } & Local) {
    const { object } = await generateObject({
      system: `sort the "array" in the "order" specified`,
      prompt: JSON.stringify({ array, order }),
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

  async function summarize({
    data,
    ...rest
  }: {
    data: unknown;
  } & Local) {
    const { text } = await generateText({
      system: `Summarize the information in "data" provided`,
      prompt: JSON.stringify({ data }),
      ...merge(options, rest),
    });
    return text;
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
    summarize,
  };
}

export type Sugar = ReturnType<typeof sugar>;
