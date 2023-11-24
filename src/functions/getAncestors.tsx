import { Key } from "react";
import { TreeNodeBase } from "../components/interface";

export const getAncestors = (
  id: Key | Key[],
  included: TreeNodeBase[],
  hierarchyNodes: TreeNodeBase[],
): TreeNodeBase[] => {
  const processIds = Array.isArray(id) ? id : [id];

  const current = processIds
    .map((i) => hierarchyNodes.find((h) => h.id === i))
    .filter((h) => h !== undefined) as TreeNodeBase[];
  if (current.length === 0) return included;

  const parents = (
    current
      .map((h) => h.parentId)
      .map((pid) => hierarchyNodes.find((h) => pid === h.id)) as TreeNodeBase[]
  ).filter((p) => p !== undefined) as TreeNodeBase[];
  if (parents.length === 0) return included;
  else
    return getAncestors(
      parents.map((p) => p.id),
      [...included, ...parents.filter((p) => !included.includes(p))],
      hierarchyNodes,
    );
};
