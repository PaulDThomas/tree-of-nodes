import { createContext, Key } from "react";
import { INodeUpdate, TreeNodeData } from "./interface";

export interface TreeOfNodesContextProps<T> {
  id: string;
  nodeList: TreeNodeData<T>[];
  selected: Key[];
  showCheckBox: boolean;
  handleSelect?: (ret: Key | Key[]) => void;
  expandedNodes: Key[];
  handleExpandClick: (ret: Key, force?: boolean) => void;
  onAddChild?: (parentId: Key, newName: string) => Promise<INodeUpdate>;
  onRename?: (id: Key, newName: string) => Promise<INodeUpdate>;
  onRemove?: (id: Key) => Promise<INodeUpdate>;
  nodeHighlight: string;
  textHighlight: string;
  spellCheck?: "true" | "false";
}

export const TreeOfNodesContext = createContext<TreeOfNodesContextProps<unknown> | undefined>(
  undefined,
);
