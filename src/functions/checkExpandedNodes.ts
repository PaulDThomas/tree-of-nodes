import { TreeNodeBase } from 'components';
import { Key } from 'react';
import { getAncestors } from './getAncestors';

export const checkExpandedNodes = (
  nodeList: TreeNodeBase[],
  selectedId: Key,
  expandedNodes: Key[],
): Key[] => {
  return [
    ...expandedNodes,
    ...getAncestors(selectedId, [], nodeList)
      .map((n) => n.id)
      .filter((k) => !expandedNodes.includes(k)),
  ].sort((a, b) => `${a}`.localeCompare(`${b}`));
};
