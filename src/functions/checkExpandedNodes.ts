import { TreeNodeBase } from 'components';
import { Key } from 'react';
import { getAncestors } from './getAncestors';

export const checkExpandedNodes = (
  nodeList: TreeNodeBase[],
  selected: Key | Key[],
  expandedNodes: Key[],
): Key[] => {
  return [
    ...expandedNodes,
    ...getAncestors(selected, [], nodeList)
      .map((n) => n.id)
      .filter((k) => !expandedNodes.includes(k)),
  ].sort((a, b) => `${a}`.localeCompare(`${b}`));
};
