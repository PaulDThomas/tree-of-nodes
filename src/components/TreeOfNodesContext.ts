import { createContext, Key } from "react";
import { iNodeUpdate, TreeNodeData } from "./interface";

export interface TreeOfNodesContextProps<T> {
  id: string;
  nodeList: TreeNodeData<T>[];
  selected: Key[];
  showCheckBox: boolean;
  handleSelect?: (ret: Key | Key[]) => void;
  expandedNodes: Key[];
  handleExpandClick: (ret: Key, force?: boolean) => void;
  onAddChild?: (parentId: Key, newName: string) => Promise<iNodeUpdate>;
  onRename?: (id: Key, newName: string) => Promise<iNodeUpdate>;
  onRemove?: (id: Key) => Promise<iNodeUpdate>;
  nodeHighlight: string;
  textHighlight: string;
  spellCheck?: "true" | "false";
}

export const TreeOfNodesContext = createContext<TreeOfNodesContextProps<unknown> | undefined>(
  undefined,
);
