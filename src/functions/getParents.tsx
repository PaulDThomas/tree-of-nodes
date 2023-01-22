import { Key } from 'react';
import { TreeNodeBase } from '../components/interface';

export const getParents = (
  id: Key,
  included: TreeNodeBase[],
  hierarchyNodes: TreeNodeBase[],
): TreeNodeBase[] => {
  // Get current node
  const current = hierarchyNodes.find((h) => h.id === id);
  if (current === undefined) return [];
  // Set return as children, current node or parent's return
  const ret =
    current.parentId === undefined ||
    current.parentId === null ||
    hierarchyNodes.findIndex((h) => h.id === current?.parentId) === -1
      ? [...included, current]
      : getParents(
          current.parentId,
          [...included.filter((c) => c.id !== current.parentId && c.id !== current.id), current],
          hierarchyNodes,
        );
  return ret;
};
