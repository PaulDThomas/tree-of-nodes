import { Key } from 'react';
import { TreeNodeBase } from '../components/interface';

export const getAncestors = (
  id: Key,
  included: TreeNodeBase[],
  hierarchyNodes: TreeNodeBase[],
): TreeNodeBase[] => {
  // Get current node
  const current = hierarchyNodes.find((h) => h.id === id);
  if (current === undefined) return [];
  // Get parent node
  const parent = hierarchyNodes.find((h) => h.id === current.parentId);
  // Stop if no more parents
  return parent === undefined
    ? included
    : getAncestors(
        parent.id,
        [...included.filter((i) => i.id !== parent.id), parent],
        hierarchyNodes,
      );
};
