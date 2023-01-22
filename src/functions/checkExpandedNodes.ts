import { TreeNodeBase } from 'components';
import { Key } from 'react';
import { getParents } from './getParents';

export const checkExpandedNodes = (
  nodeList: TreeNodeBase[],
  selectedId: Key,
  expandedNodes: Key[],
): Key[] => {
  return [
    ...expandedNodes,
    ...getParents(selectedId, [], nodeList)
      .map((n) => n.id)
      .filter((k) => !expandedNodes.includes(k)),
  ].sort((a, b) => `${a}`.localeCompare(`${b}`));
};
