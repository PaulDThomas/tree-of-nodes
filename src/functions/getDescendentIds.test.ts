import { mockNodes } from "../__mocks__/mockNodes";
import { getDescendentIds } from "./getDescendentIds";

describe("Test getDescendentIds", () => {
  test("Unknown returns self", () => {
    expect(getDescendentIds("Q", mockNodes)).toEqual(["Q"]);
  });
  test("Check bottom level returns self", () => {
    expect(getDescendentIds("Z", mockNodes)).toEqual(["Z"]);
  });
  test("Check child", () => {
    expect(getDescendentIds("A", mockNodes)).toEqual(["A", "B"]);
    expect(getDescendentIds("X", mockNodes)).toEqual(["X", "Y", "Z"]);
  });
  test("Check grandchild", () => {
    expect(getDescendentIds(0, mockNodes)).toEqual([0, "A", 1, "B", 2, 3, 4]);
  });
});
