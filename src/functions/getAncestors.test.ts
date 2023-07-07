import { mockNodes } from '../__mocks__/mockNodes';
import { getAncestors } from './getAncestors';

describe('Test getAncestors', () => {
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

describe('Test getAncestors parents badly', () => {
  test('Check missing node', () => {
    expect(getAncestors(34, [], mockNodes)).toEqual([]);
  });
});

describe('Text multiple getAncestors', () => {
  test('Check multi', async () => {
    expect(getAncestors([3, 'Z'], [], mockNodes)).toEqual([
      mockNodes[6],
      mockNodes[3],
      mockNodes[0],
    ]);
  });

  test('Check multi including', async () => {
    expect(getAncestors([3, 'Z', 0], [], mockNodes)).toEqual([
      mockNodes[6],
      mockNodes[3],
      mockNodes[0],
    ]);
  });
});
