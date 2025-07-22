import { openai } from "@ai-sdk/openai";
import assert from "node:assert";
import { it } from "node:test";
import { Sugar } from "../src/index";

export function testShortAnswer(ai: Sugar) {
  it("shortAnswer", async () => {
    const question1 = "(60 + 10) / 2";
    const result1 = await ai.shortAnswer({
      question: question1,
      model: openai("gpt-3.5-turbo"),
      maxRetries: 1,
      maxTokens: 10,
    });
    console.log(question1, result1);

    const question2 = "a goat is a mammal";
    const result2 = await ai.shortAnswer({ question: question2 });
    console.log(question2, result2);

    const question3 = "a goat is a fish";
    const result3 = await ai.shortAnswer({ question: question3 });
    console.log(question3, result3);

    const question4 = "who is the president of the united states?";
    const result4 = await ai.shortAnswer({ question: question4 });
    console.log(question4, result4);

    const question5 = "a word with 9 letters and 5 vowels";
    const result5 = await ai.shortAnswer({ question: question5 });
    console.log(question5, result5);
  });
}

export function testComplete(ai: Sugar) {
  it("complete", async () => {
    // sayings idioms proverbs riddles
    const prompt1 = "cry havoc";
    const result1 = await ai.complete({ sentence: prompt1 });
    console.log(prompt1, result1);

    const prompt2 = "who let the dogs out?";
    const result2 = await ai.complete({ sentence: prompt2 });
    console.log(prompt2, result2);

    const prompt3 = "tomato potato ";
    const result3 = await ai.complete({ sentence: prompt3 });
    console.log(prompt3, result3);

    const prompt4 = "early to bed";
    const result4 = await ai.complete({ sentence: prompt4 });
    console.log(prompt4, result4);

    const prompt5 = "birds of a feather";
    const result5 = await ai.complete({ sentence: prompt5 });
    console.log(prompt5, result5);

    const prompt6 = "the quick brown";
    const result6 = await ai.complete({ sentence: prompt6 });
    console.log(prompt6, result6);

    const prompt7 = "costs an arm ";
    const result7 = await ai.complete({ sentence: prompt7 });
    console.log(prompt7, result7);

    const prompt8 = "Don’t count your";
    const result8 = await ai.complete({ sentence: prompt8 });
    console.log(prompt8, result8);

    const prompt9 = "Absence";
    const result9 = await ai.complete({ sentence: prompt9 });
    console.log(prompt9, result9);

    const prompt10 = "Strike";
    const result10 = await ai.complete({ sentence: prompt10 });
    console.log(prompt10, result10);

    const prompt11 = "A pen";
    const result11 = await ai.complete({ sentence: prompt11 });
    console.log(prompt11, result11);

    // https://parade.com/947956/parade/riddles/
    // short answer??

    const riddle1 = "What has to be broken before you can use it?";
    const result12 = await ai.complete({ sentence: riddle1 });
    console.log(riddle1, result12);

    const riddle2 =
      "I’m tall when I’m young, and I’m short when I’m old. What am I?";
    const result13 = await ai.complete({ sentence: riddle2 });
    console.log(riddle2, result13);

    const riddle3 = "What month of the year has 28 days?";
    const result14 = await ai.complete({ sentence: riddle3 });
    console.log(riddle3, result14);

    const riddle4 = "What is full of holes but still holds water?";
    const result15 = await ai.complete({ sentence: riddle4 });
    console.log(riddle4, result15);

    const riddle5 = "What question can you never answer yes to?";
    const result16 = await ai.complete({ sentence: riddle5 });
    console.log(riddle5, result16);
  });
}

export function testIsTrue(ai: Sugar) {
  it("isTrue", async () => {
    const statement1 = "goat is a mammal";
    const result1 = await ai.isTrue({ statement: statement1 });
    assert.equal(result1, true, statement1);

    const statement2 = "goat is a fish";
    const result2 = await ai.isTrue({ statement: statement2 });
    assert.equal(result2, false, statement2);

    const statement3 = "the sun rises in the east";
    const result3 = await ai.isTrue({ statement: statement3 });
    assert.equal(result3, true, statement3);

    const statement4 = "the sun rises in the west";
    const result4 = await ai.isTrue({ statement: statement4 });
    assert.equal(result4, false, statement4);

    const statement5 = "'b' is a vowel.";
    const result5 = await ai.isTrue({ statement: statement5 });
    assert.equal(result5, false, statement5);

    const statement6 = "'o' is a vowel.";
    const result6 = await ai.isTrue({ statement: statement6 });
    assert.equal(result6, true, statement6);

    const statement7 = "1 + 1 = 2";
    const result7 = await ai.isTrue({ statement: statement7 });
    assert.equal(result7, true, statement7);

    const statement8 = "1 + 1 = 3";
    const result8 = await ai.isTrue({ statement: statement8 });
    assert.equal(result8, false, statement8);
  });
}

export function testKnows(ai: Sugar) {
  it("knows", async () => {
    const knowledge1 = "who will be the next president of the united states?";
    const result1 = await ai.knows({ knowable: knowledge1 });
    assert.equal(result1, false, knowledge1);

    const knowledge2 = "how many planets are in the solar system?";
    const result2 = await ai.knows({ knowable: knowledge2 });
    assert.equal(result2, true, knowledge2);

    const knowledge3 = "if aliens exist";
    const result3 = await ai.knows({ knowable: knowledge3 });
    console.log(knowledge3, result3);

    const knowledge4 = "what happened in San Francisco last week?";
    const result4 = await ai.knows({ knowable: knowledge4 });
    assert.equal(result4, false, knowledge4);

    const knowledge5 =
      "who is the president of the united states in July 2025?";
    const result5 = await ai.knows({ knowable: knowledge5 });
    assert.equal(result5, false, knowledge5);
  });
}

export function testCan(ai: Sugar) {
  it("can", async () => {
    const action1 = "can you do pushups?";
    const result1 = await ai.can({ doable: action1 });
    assert.equal(result1, false, action1);

    const action2 = "can you show me how to do situps?";
    const result2 = await ai.can({ doable: action2 });
    assert.equal(result2, true, action2);

    const action3 = "talk in french and portuguese";
    const result3 = await ai.can({ doable: action3 });
    assert.equal(result3, true, action3);

    const action4 = "tell me what happened in san francisco today?";
    const result4 = await ai.can({ doable: action4 });
    assert.equal(result4, false, action4);

    const action5 = "show me whats on the front page of new york times?";
    const result5 = await ai.can({ doable: action5 });
    assert.equal(result5, false, action5);

    const action6 = "Get the weather for a location";
    const result6 = await ai.can({ doable: action6 });
    assert.equal(result6, false, action6);

    const action7 = "Explain to me Einstein's theory of general relativity";
    const result7 = await ai.can({ doable: action7 });
    assert.equal(result7, true, action7);
  });
}

export function testIsCondition(ai: Sugar) {
  it("isCondition", async () => {
    const condition1 = "hallelujah";
    const result1 = await ai.isCondition({ condition: condition1 });
    assert.equal(result1, false, condition1);

    const condition2 = "chicken is a fish";
    const result2 = await ai.isCondition({ condition: condition2 });
    assert.equal(result2, true, condition2);
  });
}

export function testIsOrder(ai: Sugar) {
  it("isOrder", async () => {
    const order1 = "rainbow color order";
    const result1 = await ai.isOrder({ order: order1 });
    assert.equal(result1, true, order1);

    const order2 = "most recent first";
    const result2 = await ai.isOrder({ order: order2 });
    assert.equal(result2, true, order2);

    const order3 = "potato";
    const result3 = await ai.isOrder({ order: order3 });
    assert.equal(result3, false, order3);

    const order4 = "smallest to largest";
    const result4 = await ai.isOrder({ order: order4 });
    assert.equal(result4, true, order4);
  });
}
