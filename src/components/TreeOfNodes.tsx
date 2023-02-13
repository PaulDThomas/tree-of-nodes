import { Key, useCallback, useEffect, useState } from 'react';
import { checkExpandedNodes } from '../functions/checkExpandedNodes';
import { iNodeUpdate, TreeNodeData } from './interface';
import { TreeNode } from './TreeNode';
import { TreeOfNodesContext } from './TreeOfNodesContext';

interface TreeOfNodesProps<T> {
  id: string;
  nodeList: TreeNodeData<T>[];
  roots: Key[];
  selectedId?: Key;
  handleSelect?: (ret: Key) => void;
  onAdd?: (parentId: Key, newName: string) => Promise<iNodeUpdate>;
  onRename?: (childId: Key, newName: string) => Promise<iNodeUpdate>;
  onRemove?: (childId: Key) => Promise<iNodeUpdate>;
  canAddRoot?: boolean;
  canRemoveRoot?: boolean;
  canRenameRoot?: boolean;
  canAddChildren?: boolean;
  canRemoveChildren?: boolean;
  canRenameChildren?: boolean;
  nodeHighlight?: string;
  textHighlight?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const TreeOfNodes = <T extends unknown>({
  id,
  nodeList,
  roots,
  // canAddRoot = false,
  canRemoveRoot = false,
  canRenameRoot = false,
  canAddChildren = false,
  canRemoveChildren = false,
  canRenameChildren = false,
  selectedId,
  handleSelect = () => {
    return;
  },
  onAdd,
  onRename,
  onRemove,
  nodeHighlight = 'red',
  textHighlight = 'rgba(255, 0, 0, 0.2)',
}: TreeOfNodesProps<T>) => {
  const [expandedNodes, setExpandedNodes] = useState<Key[]>([]);
  useEffect(() => {
    if (selectedId) {
      // Check all nodes are showing that should be
      const shouldExpand = checkExpandedNodes(nodeList, selectedId, expandedNodes);
      shouldExpand.filter((n) => !expandedNodes.includes(n)).length > 0 &&
        setExpandedNodes(shouldExpand);
    }
  }, [expandedNodes, nodeList, selectedId]);

  // Change expansion and update contexts
  const changeExpand = useCallback(
    (eKey: Key, force?: boolean) => {
      const newExpandedNodes = [...expandedNodes];
      const ix = newExpandedNodes.findIndex((nKey) => nKey === eKey);
      if ((ix === -1 && force === undefined) || force === true) newExpandedNodes.push(eKey);
      else newExpandedNodes.splice(ix, 1);
      setExpandedNodes(newExpandedNodes);
    },
    [expandedNodes],
  );

  return (
    <TreeOfNodesContext.Provider
      value={{
        id: id,
        nodeList,
        selectedId,
        handleSelect,
        expandedNodes,
        handleExpandClick: (r, f) => changeExpand(r, f),
        onAddChild: onAdd,
        onRename,
        onRemove,
        nodeHighlight,
        textHighlight,
      }}
    >
      {roots.map((r) => (
        <TreeNode
          key={r}
          id={r}
          canRemove={canRemoveRoot}
          canAddChildren={canAddChildren}
          canRename={canRenameRoot}
          canRemoveChildren={canRemoveChildren}
          canRenameChildren={canRenameChildren}
        />
      ))}
    </TreeOfNodesContext.Provider>
  );
};
