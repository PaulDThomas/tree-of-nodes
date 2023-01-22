import { checkExpandedNodes } from '../functions/checkExpandedNodes';
import { mockNodes } from '../__mocks__/mockNodes';

describe('Test checkExpandedNodes', () => {
  test('Check return', () => {
    expect(checkExpandedNodes(mockNodes, 4, [0, 'A'])).toEqual([0, 1, 4, 'A']);
  });
});
