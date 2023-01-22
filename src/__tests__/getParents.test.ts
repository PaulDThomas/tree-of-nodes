import { mockNodes } from '../__mocks__/mockNodes';
import { getParents } from '../functions/getParents';

describe('Test get parents', () => {
  test('Check top level return self', () => {
    expect(getParents(0, [], mockNodes)).toEqual([mockNodes.find((n) => n.id === 0)]);
  });

  test('Check child', () => {
    expect(getParents('A', [], mockNodes)).toEqual([mockNodes[1], mockNodes[0]]);
  });
  test('Check grandchild', () => {
    // Nothing expanded
    expect(getParents('B', [], mockNodes)).toEqual([mockNodes[2], mockNodes[1], mockNodes[0]]);
    // Current expanded
    expect(getParents('A', [mockNodes[2]], mockNodes)).toEqual([
      mockNodes[2],
      mockNodes[1],
      mockNodes[0],
    ]);
  });
  // Expected expanded
  expect(getParents('B', [mockNodes[2], mockNodes[1], mockNodes[0]], mockNodes)).toEqual([
    mockNodes[2],
    mockNodes[1],
    mockNodes[0],
  ]);
  // Middle expanded
  expect(getParents('B', [mockNodes[1]], mockNodes)).toEqual([
    mockNodes[2],
    mockNodes[1],
    mockNodes[0],
  ]);
});

describe('Test Get hierarchy parents badly', () => {
  test('Check missing node', () => {
    expect(getParents(34, [], mockNodes)).toEqual([]);
  });
});
