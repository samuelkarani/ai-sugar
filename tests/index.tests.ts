import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { sugar } from "../src/index";
import { testCreateArray, testCreateObject, testCreateText } from "./creators";
import {
  testEveryConcurrent,
  testEveryGenerate,
  testEverySerial,
} from "./every";
import {
  testFilterConcurrent,
  testFilterGenerate,
  testFilterSerial,
} from "./filter";
import { testFindConcurrent, testFindGenerate, testFindSerial } from "./find";
import {
  testFindIndexConcurrent,
  testFindIndexGenerate,
  testFindIndexSerial,
} from "./findIndex";
import { testIsTrueArray, testIsTrueValue } from "./predicates";
import {
  testCan,
  testComplete,
  testIsCondition,
  testIsOrder,
  testIsTrue,
  testKnows,
  testShortAnswer,
} from "./primitives";
import { testSomeConcurrent, testSomeGenerate, testSomeSerial } from "./some";
import { testToSortedGenerate } from "./sort";

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
  arrays,
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
  arrays?: boolean;
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

  if (everySerial || every || arrays || all) testEverySerial(ai);
  if (everyConcurrent || every || arrays || all) testEveryConcurrent(ai);
  if (everyGenerate || every || arrays || all) testEveryGenerate(ai);

  if (filterSerial || filter || arrays || all) testFilterSerial(ai, verbose);
  if (filterConcurrent || filter || arrays || all) testFilterConcurrent(ai);
  if (filterGenerate || filter || arrays || all) testFilterGenerate(ai);

  if (findSerial || find || arrays || all) testFindSerial(ai);
  if (findConcurrent || find || arrays || all) testFindConcurrent(ai);
  if (findGenerate || find || arrays || all) testFindGenerate(ai);

  if (findIndexSerial || findIndex || arrays || all) testFindIndexSerial(ai);
  if (findIndexConcurrent || findIndex || arrays || all)
    testFindIndexConcurrent(ai);
  if (findIndexGenerate || findIndex || arrays || all)
    testFindIndexGenerate(ai);

  if (someSerial || some || arrays || all) testSomeSerial(ai);
  if (someConcurrent || some || arrays || all) testSomeConcurrent(ai);
  if (someGenerate || some || arrays || all) testSomeGenerate(ai);

  if (sort || arrays || all) testToSortedGenerate(ai, verbose);
}

test({
  verbose: true,
  primitives: true,
  creators: true,
  predicates: true,
  arrays: true,
  all: true,
});
