import { Key, useCallback, useEffect, useMemo, useState } from 'react';
import { checkExpandedNodes } from '../functions/checkExpandedNodes';
import { iNodeUpdate, TreeNodeData } from './interface';
import { TreeNode } from './TreeNode';
import { TreeOfNodesContext } from './TreeOfNodesContext';

interface TreeOfNodesProps<T> {
  id: string;
  nodeList: TreeNodeData<T>[];
  roots: Key[];
  showCheckBox?: boolean;
  selected?: Key | Key[];
  handleSelect?: (ret: Key | Key[]) => void;
  onAdd?: (parentId: Key, newName: string) => Promise<iNodeUpdate>;
  onRename?: (childId: Key, newName: string) => Promise<iNodeUpdate>;
  onRemove?: (childId: Key) => Promise<iNodeUpdate>;
  canRemoveRoot?: boolean;
  canRenameRoot?: boolean;
  canAddChildren?: boolean;
  canRemoveChildren?: boolean;
  canRenameChildren?: boolean;
  nodeHighlight?: string;
  textHighlight?: string;
  spellCheck?: 'true' | 'false';
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const TreeOfNodes = <T extends unknown>({
  id,
  nodeList,
  roots,
  selected = [],
  showCheckBox = false,
  handleSelect = () => {
    return;
  },
  onAdd,
  onRename,
  onRemove,
  canRemoveRoot = false,
  canRenameRoot = false,
  canAddChildren = false,
  canRemoveChildren = false,
  canRenameChildren = false,
  nodeHighlight = 'red',
  textHighlight = 'rgba(255, 0, 0, 0.2)',
  spellCheck = 'true',
}: TreeOfNodesProps<T>) => {
  const [expandedNodes, setExpandedNodes] = useState<Key[]>([]);
  const selectedArray = useMemo(
    () => (Array.isArray(selected) ? selected : [selected]),
    [selected],
  );
  useEffect(() => {
    if (selectedArray.length > 0) {
      // Check all nodes are showing that should be
      const shouldExpand = checkExpandedNodes(nodeList, selectedArray, expandedNodes);
      shouldExpand.filter((n) => !expandedNodes.includes(n)).length > 0 &&
        setExpandedNodes(shouldExpand);
    }
  }, [expandedNodes, nodeList, selectedArray]);

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
        selected: selectedArray,
        showCheckBox,
        handleSelect,
        expandedNodes,
        handleExpandClick: (r, f) => changeExpand(r, f),
        onAddChild: onAdd,
        onRename,
        onRemove,
        nodeHighlight,
        textHighlight,
        spellCheck,
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

TreeOfNodes.displayName = 'TreeOfNodes';
