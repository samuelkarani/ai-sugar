import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { sugar } from "./ai";
import {
  testCreateArray,
  testCreateObject,
  testCreateText,
} from "./tests/creators";
import {
  testEveryConcurrent,
  testEveryGenerate,
  testEverySerial,
} from "./tests/every";
import {
  testFilterConcurrent,
  testFilterGenerate,
  testFilterSerial,
} from "./tests/filter";
import {
  testFindConcurrent,
  testFindGenerate,
  testFindSerial,
} from "./tests/find";
import {
  testFindIndexConcurrent,
  testFindIndexGenerate,
  testFindIndexSerial,
} from "./tests/findIndex";
import { testIsTrueArray, testIsTrueValue } from "./tests/predicates";
import {
  testCan,
  testComplete,
  testIsCondition,
  testIsOrder,
  testIsTrue,
  testKnows,
  testShortAnswer,
} from "./tests/primitives";
import {
  testSomeConcurrent,
  testSomeGenerate,
  testSomeSerial,
} from "./tests/some";
import { testToSortedGenerate } from "./tests/sort";

async function test({
  shortAnswer,
  complete,
  isTrue,
  knows,
  can,
  primitives,
  isCondition,
  isOrder,
  createObject,
  createText,
  createArray,
  creators,
  isTrueValue,
  isTrueArray,
  predicates,
  everySerial,
  everyConcurrent,
  everyGenerate,
  every,
  filterSerial,
  filterConcurrent,
  filterGenerate,
  filter,
  findSerial,
  findConcurrent,
  findGenerate,
  find,
  findIndexSerial,
  findIndexConcurrent,
  findIndexGenerate,
  findIndex,
  someSerial,
  someConcurrent,
  someGenerate,
  some,
  sort,
  verbose,
  all,
}: {
  shortAnswer?: boolean;
  complete?: boolean;
  isTrue?: boolean;
  knows?: boolean;
  can?: boolean;
  primitives?: boolean;
  isCondition?: boolean;
  isOrder?: boolean;
  createObject?: boolean;
  createText?: boolean;
  createArray?: boolean;
  creators?: boolean;
  isTrueValue?: boolean;
  isTrueArray?: boolean;
  predicates?: boolean;
  everySerial?: boolean;
  everyConcurrent?: boolean;
  everyGenerate?: boolean;
  every?: boolean;
  filterSerial?: boolean;
  filterConcurrent?: boolean;
  filterGenerate?: boolean;
  filter?: boolean;
  findSerial?: boolean;
  findConcurrent?: boolean;
  findGenerate?: boolean;
  find?: boolean;
  findIndexSerial?: boolean;
  findIndexConcurrent?: boolean;
  findIndexGenerate?: boolean;
  findIndex?: boolean;
  someSerial?: boolean;
  someConcurrent?: boolean;
  someGenerate?: boolean;
  some?: boolean;
  sort?: boolean;
  verbose?: boolean;
  all?: boolean;
}) {
  const geminiModel = google("gemini-2.5-pro-preview-06-05");
  const openaiModel = openai.responses("gpt-4o");
  const claudeMode = anthropic("claude-3-7-sonnet-20250219");
  const ai = sugar({ model: openaiModel });

  if (shortAnswer || primitives || all) testShortAnswer(ai);
  if (complete || primitives || all) testComplete(ai);
  if (isTrue || primitives || all) testIsTrue(ai);
  if (knows || primitives || all) testKnows(ai);
  if (can || primitives || all) testCan(ai);
  if (isCondition || primitives || all) testIsCondition(ai);
  if (isOrder || primitives || all) testIsOrder(ai);

  if (createText || creators || all) testCreateText(ai);
  if (createObject || creators || all) testCreateObject(ai);
  if (createArray || creators || all) testCreateArray(ai);

  if (isTrueValue || predicates || all) testIsTrueValue(ai);
  if (isTrueArray || predicates || all) testIsTrueArray(ai, verbose);

  if (everySerial || every || all) testEverySerial(ai);
  if (everyConcurrent || every || all) testEveryConcurrent(ai);
  if (everyGenerate || every || all) testEveryGenerate(ai);

  if (filterSerial || filter || all) testFilterSerial(ai, verbose);
  if (filterConcurrent || filter || all) testFilterConcurrent(ai);
  if (filterGenerate || filter || all) testFilterGenerate(ai);

  if (findSerial || find || all) testFindSerial(ai);
  if (findConcurrent || find || all) testFindConcurrent(ai);
  if (findGenerate || find || all) testFindGenerate(ai);

  if (findIndexSerial || findIndex || all) testFindIndexSerial(ai);
  if (findIndexConcurrent || findIndex || all) testFindIndexConcurrent(ai);
  if (findIndexGenerate || findIndex || all) testFindIndexGenerate(ai);

  if (someSerial || some || all) testSomeSerial(ai);
  if (someConcurrent || some || all) testSomeConcurrent(ai);
  if (someGenerate || some || all) testSomeGenerate(ai);

  if (sort || all) testToSortedGenerate(ai, verbose);
}

test({
  verbose: true,
  primitives: true,
  creators: true,
  predicates: true,
  every: true,
  filter: true,
  find: true,
  findIndex: true,
  some: true,
  sort: true,
  all: true,
});
