import { mockNodes } from '../__mocks__/mockNodes';
import { getAncestors } from '../functions/getAncestors';

describe('Test get parents', () => {
  test('Check top level return empty', () => {
    expect(getAncestors(0, [], mockNodes)).toEqual([]);
  });

  test('Check child', () => {
    expect(getAncestors('A', [], mockNodes)).toEqual([mockNodes[0]]);
  });
  test('Check grandchild', () => {
    // Nothing expanded
    expect(getAncestors('B', [], mockNodes)).toEqual([mockNodes[1], mockNodes[0]]);
    // Current expanded
    expect(getAncestors('A', [mockNodes[2]], mockNodes)).toEqual([mockNodes[2], mockNodes[0]]);
  });
  // Expected expanded
  expect(getAncestors('B', [mockNodes[2], mockNodes[1], mockNodes[0]], mockNodes)).toEqual([
    mockNodes[2],
    mockNodes[1],
    mockNodes[0],
  ]);
  // Middle expanded
  expect(getAncestors('B', [mockNodes[1]], mockNodes)).toEqual([mockNodes[1], mockNodes[0]]);
});

describe('Test Get hierarchy parents badly', () => {
  test('Check missing node', () => {
    expect(getAncestors(34, [], mockNodes)).toEqual([]);
  });
});
