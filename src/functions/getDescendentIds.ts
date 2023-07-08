import { Key } from 'react';
import { TreeNodeBase } from '../components/interface';

export const getDescendentIds = (id: Key | Key[], hierarchyNodes: TreeNodeBase[]): Key[] => {
  const processIds = Array.isArray(id) ? id : [id];
  const newChildren = hierarchyNodes
    .filter(
      (h) =>
        h.parentId !== undefined && processIds.includes(h.parentId) && !processIds.includes(h.id),
    )
    .map((h) => h.id);
  return newChildren.length === 0
    ? processIds
    : getDescendentIds([...processIds, ...newChildren], hierarchyNodes);
};
