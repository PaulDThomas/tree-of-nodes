import { createContext, Key, useCallback, useState } from 'react';
import { ContextMenuProvider } from './ContextMenuProvider';
import { TreeNode } from './TreeNode';

export type TreeNodeBase = {
  id: Key;
  label: string;
  parentId?: Key;
};

export type TreeNodeData<T> = {
  id: Key;
  label: string;
  parentId?: Key;
  data: T;
};

export interface iNodeUpdate {
  success: boolean;
  ErrorText?: string;
}

interface iTreeOfNodes<T> {
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
}

type TreeOfNodesContextData<T> = {
  id: string;
  nodeList: TreeNodeData<T>[];
  selectedId?: Key;
  handleSelect?: (ret: Key) => void;
  expandedNodes?: Key[];
  handleExpandClick?: (ret: Key, force?: boolean) => void;
  onAddChild?: (parentId: Key, newName: string) => Promise<iNodeUpdate>;
  onRename?: (id: Key, newName: string) => Promise<iNodeUpdate>;
  onRemove?: (id: Key) => Promise<iNodeUpdate>;
};

export const TreeOfNodesContext = createContext<TreeOfNodesContextData<unknown>>({
  id: 'tree-of-nodes',
  nodeList: [],
});

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
}: iTreeOfNodes<T>) => {
  const [expandedNodes, setExpandedNodes] = useState<Key[]>([]);

  // Change expansion and update context
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
    <ContextMenuProvider>
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
    </ContextMenuProvider>
  );
};
