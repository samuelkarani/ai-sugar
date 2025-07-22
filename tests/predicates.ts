import assert from "node:assert";
import { it } from "node:test";
import { Sugar } from "../src/index";

export function testIsTrueValue(ai: Sugar) {
  it("isTrueValue", async () => {
    const condition1 = "is a mammal";
    const value1 = "goat";
    const result1 = await ai.isTrueValue({
      value: value1,
      condition: condition1,
    });
    assert.equal(result1, true);

    const condition2 = "is a fish";
    const value2 = "goat";
    const result2 = await ai.isTrueValue({
      value: value2,
      condition: condition2,
    });
    assert.equal(result2, false);
  });
}

export function testIsTrueArray(ai: Sugar, verbose?: boolean) {
  const array = ["goat", "fish", "monkey", "cat", "dog", "chicken", "lion"];
  if (verbose) console.log("animals:", array);

  it("isTrueArray", async () => {
    const condition1 = "is not a mammal";
    const result1 = await ai.isTrueArray({
      array,
      condition: condition1,
    });
    const mammals = array.filter((item, index) => !result1[index]);
    const notMammals = array.filter((item, index) => result1[index]);
    console.log("mammals:", mammals);
    console.log("not mammals:", notMammals);

    const condition2 = "is a domestic animal";
    const result2 = await ai.isTrueArray({
      array,
      condition: condition2,
    });
    const domesticAnimals = array.filter((item, index) => result2[index]);
    const notDomesticAnimals = array.filter((item, index) => !result2[index]);
    console.log("domestic animals:", domesticAnimals);
    console.log("not domestic animals:", notDomesticAnimals);

    const condition3 = "is a wild animal";
    const result3 = await ai.isTrueArray({
      array,
      condition: condition3,
    });
    const wildAnimals = array.filter((item, index) => result3[index]);
    const notWildAnimals = array.filter((item, index) => !result3[index]);
    console.log("wild animals:", wildAnimals);
    console.log("not wild animals:", notWildAnimals);

    const colors = ["red", "white", "green", "blue", "yellow", "black"];
    if (verbose) console.log("colors:", colors);

    const condition4 = "is a rainbow color";
    const result4 = await ai.isTrueArray({
      array: colors,
      condition: condition4,
    });
    const rainbowColors = colors.filter((item, index) => result4[index]);
    const notRainbowColors = colors.filter((item, index) => !result4[index]);
    console.log("rainbow colors:", rainbowColors);
    console.log("not rainbow colors:", notRainbowColors);
  });
}
