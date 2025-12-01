import { mockNodes } from "../__mocks__/mockNodes";
import { checkExpandedNodes } from "./checkExpandedNodes";

describe("Test checkExpandedNodes", () => {
  test("Check return", () => {
    expect(checkExpandedNodes(mockNodes, 4, [0, "A"])).toEqual([0, 1, "A"]);
  });
});
