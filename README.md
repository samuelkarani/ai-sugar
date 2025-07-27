<!-- Thanks to our first sponsor Similarly: -->
<!-- You can try or fork these examples here: -->

## What is AI Sugar?

AI Sugar is a collection of utility functions powered by AI. This initial version is built on top of [Vercel AI SDK](https://ai-sdk.dev).
Kinda like "lodash for AI" for those old enough to remember it - or Underscore!

What's more, it allows you break out of the declarative model of Vercel's AI SDK into an imperative one particularly when building tools.

AI Sugar is built with Typescript for Node.js

## Getting started

Make sure you have [Vercel AI SDK](https://ai-sdk.dev/docs/introduction) setup up

Installing:

```
npm install ai-sugar
yarn add ai-sugar
pnpm install ai-sugar
```

Using:

```
import sugar from "ai-sugar"
import { openai } from "@ai-sdk/openai";

const gpt = openai.responses("gpt-4o");
const ai = sugar({ model: gpt });

const result1 = await ai.sort({
  array: ["green", "red", "blue", "yellow"],
  prompt: "rainbow color order",
});
// ["red", "yellow", "green", "blue"]
```

Supports all the models supported by Vercel AI SDK like Google Gemini, OpenAI ChatGPT, Anthropic Claude etc. For functions returning non-string outputs i.e. `boolean`, `array`, `object`, `number` make sure the model you provide supports **structured outputs**.

## What's in the package?

A set of 'primitive' functions: `isTrue`, `knows`, `can` `shortAnswer` `complete`

```
await ai.isTrue({ prompt: "goat is a mammal" }); // true
await ai.isTrue({ prompt: "goat is a fish" }); // false

await ai.shortAnswer({ prompt: "(60 + 10) / 2" }); // 35
await ai.shortAnswer({ prompt: "who is the president of the united states?" }); // Joe Biden (obviously out of date)
await ai.shortAnswer({ prompt: "a word with 9 letters and 5 vowels" }); // education

await ai.can({ prompt: "Get the weather for a location" }); // false
await ai.can({ prompt: "Explain to me Einstein's theory of general relativity" }); // true

await ai.complete({ prompt: "who let the dogs out?" }); // Who, who, who, who!
await ai.complete({ prompt: "cry havoc " }); // and let slip the dogs of war!
await ai.complete({ prompt: "what question can you never answer yes to?" }); // "Are you asleep?"

```

A set of prompt argument validators: `isCondition`, `isOrder`

```
await ai.isCondition({ prompt: "chicken is a fish" }); // true
await ai.isOrder({ prompt: "most recent first" }); // true
```

A set of creator functions: `createText`, `createObject`, `createArray`. `createText` is the same as `shortAnswer`.

```
const book = await ai.createObject({
  prompt: "a popular book",
  schema: z.object({
    title: z.string(),
    author: z.string(),
    genre: z.string(),
  }),
}); // { "title": "To Kill a Mockingbird", "author": "Harper Lee", ... }

const authors = await ai.createArray({
  prompt: "best russian authors",
  schema: z.string(),
}); // [ 'Leo Tolstoy', 'Fyodor Dostoevsky', ... ]

const companies = await ai.createArray({
  prompt: "Top AI companies",
  schema: z.object({
    name: z.string(),
    ceo: z.string(),
    products: z.array(z.string()),
  }),
  length: 3,
});
// [
  { name: 'OpenAI', ceo: 'Sam Altman', products: [ 'ChatGPT', 'DALL-E', 'Codex' ] },
  { name: 'Google DeepMind', ceo: 'Demis Hassabis', products: [ 'AlphaGo', 'AlphaFold', 'WaveNet' ] },
... ]
```

A set of predicate functions:

- `isTrueValue` evaluates a prompt with a value to return a boolean
- `isTrueArray` evaluates a prompt with an array (for every item in the array) to return an array of booleans

```
const value = "goat";
await ai.isTrueValue({ value: value, prompt: "is a mammal" }); // true
await ai.isTrueValue({ value: value, prompt: "is a fish" }); // false

await ai.isTrueArray({
  array: ["goat", "fish", "monkey", "chicken"]
  prompt: "is a mammal",
}); // [true, false, true, false]
```

A set of array functions with a condition prompt instead of a predicate/comparator: `every`, `filter`, `find`, `findIndex`, `some`, `toSorted`.
The callback is a natural language condition that evaluates to either true or false.
Each function exposed 3 versions:

- _serial_ runs the predicates one at time while processing the result - uses the suffix **Serial**
- _concurrent_ runs the all predicates at the same time then processes the result afterwards - uses the suffix **Concurrent**
- _generate_ uses the AI to create the result - uses the suffix **Generate** and in some cases requires a schema be provided

The concurrent version is the default i.e. `find` is the same as `findConcurrent`

```
const result4 = await ai.filter({ // same as filterConcurrent
  array: ["red", "white", "green", "blue", "yellow", "black"],
  prompt: "is a rainbow color",
}); // ["red", "green", "blue", "yellow"]

const result5 = await ai.filterGenerate({
  array: ["red", "white", "green", "blue", "yellow", "black"],
  prompt: "is a rainbow color",
  schema: z.string() // requires item schema
}); // ["red", "green", "blue", "yellow"]
```

## Options & Telemetry

Internally a collection of prompts power each function. As a result we collect telemetry data in order to improve the efficacy of our prompts. You can opt out of sharing any data with us by becoming a sponsor at whatever amount you are comfortable with. This will also make using your functions slightly faster (5-10%). Details are in the **Become a sponsor** section below.

You can use different models with different functions. In addition to `model` you can pass other parameters supported by the AI SDK like `maxTokens`, `maxRetries`. Any arguments passed to a function override the global options passed to the `sugar` function.

```
const ai = sugar({
  model: openai.responses("gpt-4o"),
  maxRetries: 2,
  maxTokens: 1000,
}); // options later overridden
const result1 = await ai.shortAnswer({
  prompt: "who is the president of the united states?",
  model: google("gemini-2.0-flash"),
  maxRetries: 1,
  maxTokens: 100,
}); // options take precedence
const result2 = await ai.shortAnswer({
  prompt: "what happened in San Francisco last week?",
  model: anthropic("claude-3-7-sonnet-20250219"),
}); // overrides global model

```

<!-- Additionally you can also pass the following arguments: -->

## Tool use example ([Vercel example](https://ai-sdk.dev/cookbook/node/web-search-agent#exa))

Setup:

```
const model = openai("gpt-4o");
const prompt = "What happened in San Francisco last week?";
function searchExa() ... // web search api
```

Vercel's AI SDK wants you to code like this:

```
const { text, sources } = await generateText({
  model: model,
  prompt: prompt,
  tools: {
    // each tool comes with a management and "orchestration" cost
    webSearch: tool({
      description: "Search the web for up-to-date information", // more prompting
      parameters: z.object({
        // could generate irrelevant queries
        query: z.string().min(1).max(100).describe("The search query"),
      }),
      execute: async ({ query }) => {
        return searchExa(query); // could be called multiple times
      },
    }),
  },
  maxSteps: 3, // requires guessing/approximating
  toolChoice: "required", // could still be ignored
});
// 20.196s
// often returns { text: '', sources: [] } despite tool being called
```

Instead you can code like this:

```
if (await ai.knows({ prompt: prompt })) {
  const { text } = await generateText({
    model: model,
    prompt: prompt,
  });
} else {
    const results = await searchExa(prompt);
    const text = await ai.summarize({ data: results });
}
// 8.899s
// { text: 'Last week in San Francisco, two major events took place. Firstly, ...', sources: [] }
```

## Thanks for reading

I welcome your input, suggestions, feedback. You can read more in this [medium article](https://medium.com/@samiezkay/ai-sugar-for-regular-programmers-the-silent-majority-2e709dcd22b4) I wrote about AI sugar.

Check out the following related libraries that I also built with this release. Both are used internally in this library.

[arrays-sugar](https://github.com/samuelkarani/arrays-sugar) Arrays Sugar is a set of array methods supporting async callbacks: `everyAsync`, `filterAsync`, `findAsync`, `findIndexAsync`, `someAsync`:

```
const array = [1, 2, 3];
array.findIndex(async (number) => number === 2) // 0 ❌
findIndex(array, async (number) => number === 2) // 1 ✅
```

[zod-sugar](https://github.com/samuelkarani/zod-sugar) Zod Sugar is basically zod in reverse i.e. creates a zod schema from any value:

```
const schema = createZod({ foo: "bar", baz: 1 });
// z.object({ foo: z.string(), bar: z.number() });
schema.safeParse({ foo: "bar", baz: 1 }).success // true
```

## [Become a sponsor - starting 5$](https://coff.ee/samuelkarani)

Support us if you would like this work to continue! You can contribute on either on [Patreon](https://patreon.com/samuelkarani) or [BuyMeACoffee](https://coff.ee/samuelkarani) - once or monthly. Sponsorship allows development and maintenance of all 3 sugar libraries i.e. [ai-sugar](https://github.com/samuelkarani/ai-sugar), [arrays-sugar](https://github.com/samuelkarani/arays-sugar) and [zod-sugar](https://github.com/samuelkarani/zod-sugar).

<!-- Github Sponsors program. -->

<!-- You can become a sponsor at whatever amount you are comfortable with.

- For individuals, starting $5 monthly or a one-time payment.
- For companies, starting $100 monthly or a one-time payment.

As a sponsor you can have yours or your organization's name or photo featured in our upcoming sponsors list tiers.
The list tiers will be updated every month to reflect the total contributions for every individual and company. -->

<!-- Additionally each person & company gets 144 characters to promote anything they would want. -->

### Where you can find me

You can reach me via email at samuel.karani@berkeley.edu

I occasionally inhabit Twitter https://x.com/samuel_karani

<!-- I also have an [Instagram](https://www.instagram.com/samiezkay) -->

### What I'm building

[![Similarly logo](images/similarly.png)](https://chromewebstore.google.com/detail/similarsites+-discover-al/dhahadpjpmphckgebnikgpdhaolcojdg)

Find the best alternatives with one click. Discover similar websites, tools and services instantly while browsing. Never miss out on better options again.
[Check out Similarly](https://chromewebstore.google.com/detail/similarsites+-discover-al/dhahadpjpmphckgebnikgpdhaolcojdg)

<!-- I am also a co-founder at PollGPT and we're currently on the lookout for investors - reach out if you're interested in building the future of research with AI. -->

<!-- ### Don't read this:

My comment on the v0 launch video on YouTube was one of the most liked - yikes!
![Youtube v0](images/screenshot2.png)

Guillermo Rauch, Vercel's CEO responded to my question about Zeit (Vercel) way back in the day over on Twitter
![Guillermo Rauch](images/screenshot1.png) -->

<!-- Inspirations:
https://www.npmjs.com/package/autolinker -->
<!-- https://developer.chrome.com/docs/ai/writer-api#api_functions -->
