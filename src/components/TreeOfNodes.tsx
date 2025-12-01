import { Key, useEffect, useState } from "react";
import { checkExpandedNodes } from "../functions/checkExpandedNodes";
import { INodeUpdate, TreeNodeData } from "./interface";
import { TreeNode } from "./TreeNode";
import { TreeOfNodesContext } from "./TreeOfNodesContext";

export interface TreeOfNodesProps<T> {
  alwaysShowSelected?: "always" | "first";
  canAddChildren?: boolean;
  canRemoveChildren?: boolean;
  canRemoveRoot?: boolean;
  canRenameChildren?: boolean;
  canRenameRoot?: boolean;
  handleSelect?: (ret: Key | Key[]) => void;
  id: string;
  nodeHighlight?: string;
  nodeList: TreeNodeData<T>[];
  onAdd?: (parentId: Key, newName: string) => Promise<INodeUpdate>;
  onRemove?: (childId: Key) => Promise<INodeUpdate>;
  onRename?: (childId: Key, newName: string) => Promise<INodeUpdate>;
  roots: Key[];
  selected?: Key | Key[];
  showCheckBox?: boolean;
  spellCheck?: "true" | "false";
  textHighlight?: string;
}

export const TreeOfNodes = <T,>({
  alwaysShowSelected = "first",
  canAddChildren = false,
  canRemoveChildren = false,
  canRemoveRoot = false,
  canRenameChildren = false,
  canRenameRoot = false,
  handleSelect,
  id,
  nodeHighlight = "red",
  nodeList,
  onAdd,
  onRemove,
  onRename,
  roots,
  selected = [],
  showCheckBox = false,
  spellCheck = "true",
  textHighlight = "rgba(255, 0, 0, 0.2)",
}: TreeOfNodesProps<T>) => {
  const [firstRender, setFirstRender] = useState<boolean>(alwaysShowSelected === "first");
  const [expandedNodes, setExpandedNodes] = useState<Key[]>([]);
  useEffect(() => {
    const selectedArray = Array.isArray(selected) ? selected : [selected];
    if ((alwaysShowSelected === "always" || firstRender) && selectedArray.length > 0) {
      // Check all nodes are showing that should be
      const shouldExpand = checkExpandedNodes(nodeList, selectedArray, expandedNodes);
      if (shouldExpand.filter((n) => !expandedNodes.includes(n)).length > 0) {
        setExpandedNodes(shouldExpand);
      }
      setFirstRender(false);
    }
  }, [alwaysShowSelected, firstRender, expandedNodes, nodeList, selected]);

  // Change expansion and update contexts
  const changeExpand = (eKey: Key, force?: boolean) => {
    const newExpandedNodes = [...expandedNodes];
    const ix = newExpandedNodes.findIndex((nKey) => nKey === eKey);
    if ((ix === -1 && force === undefined) || force === true) newExpandedNodes.push(eKey);
    else newExpandedNodes.splice(ix, 1);
    setExpandedNodes(newExpandedNodes);
  };

  return (
    <div
      id={id}
      className="tree-of-nodes"
    >
      <TreeOfNodesContext.Provider
        value={{
          id: id,
          expandedNodes,
          handleExpandClick: (r, f) => changeExpand(r, f),
          handleSelect,
          nodeHighlight,
          nodeList,
          onAddChild: onAdd,
          onRemove,
          onRename,
          selected: Array.isArray(selected) ? selected : [selected],
          showCheckBox,
          spellCheck,
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
    </div>
  );
};

TreeOfNodes.displayName = "TreeOfNodes";
