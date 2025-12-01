import type { Meta, StoryObj } from "@storybook/react-vite";
import { Key, useState } from "react";
import { mockNodes } from "../__mocks__/mockNodes";
import { TreeNodeData } from "./interface";
import { TreeNode } from "./TreeNode";
import "./TreeNode.css";
import { TreeOfNodesContext, TreeOfNodesContextProps } from "./TreeOfNodesContext";

// Wrapper to provide context for TreeNode
const TreeNodeWithContext = ({
  nodeId,
  canRemove = false,
  canRename = false,
  canAddChildren = false,
  canRemoveChildren = false,
  canRenameChildren = false,
  showCheckBox = false,
  nodeHighlight = "red",
  textHighlight = "rgba(255, 0, 0, 0.2)",
  spellCheck = "true",
}: {
  nodeId: Key;
  canRemove?: boolean;
  canRename?: boolean;
  canAddChildren?: boolean;
  canRemoveChildren?: boolean;
  canRenameChildren?: boolean;
  showCheckBox?: boolean;
  nodeHighlight?: string;
  textHighlight?: string;
  spellCheck?: "true" | "false";
}) => {
  const [nodeList, setNodeList] =
    useState<TreeNodeData<{ value: number } | number | undefined>[]>(mockNodes);
  const [selected, setSelected] = useState<Key[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Key[]>([]);

  const contextValue: TreeOfNodesContextProps<{ value: number } | number | undefined> = {
    id: "treenode-story",
    nodeList,
    selected,
    showCheckBox,
    handleSelect: (ret) => {
      if (Array.isArray(ret)) {
        setSelected(ret);
      } else {
        setSelected([ret]);
      }
    },
    expandedNodes,
    handleExpandClick: (id, force) => {
      if (force === true) {
        setExpandedNodes((prev) => [...prev, id]);
      } else if (force === false) {
        setExpandedNodes((prev) => prev.filter((e) => e !== id));
      } else {
        setExpandedNodes((prev) =>
          prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id],
        );
      }
    },
    onAddChild: async (parentId, newName) => {
      const newId = Math.max(...nodeList.map((n) => (typeof n.id === "number" ? n.id : 0))) + 1;
      setNodeList([...nodeList, { id: newId, parentId, label: newName, data: newId }]);
      return { success: true };
    },
    onRename: async (id, newName) => {
      const ix = nodeList.findIndex((n) => n.id === id);
      if (ix === -1) return { success: false };
      const newNodes = [...nodeList];
      newNodes.splice(ix, 1, { ...nodeList[ix], label: newName });
      setNodeList(newNodes);
      return { success: true };
    },
    onRemove: async (id) => {
      const ix = nodeList.findIndex((n) => n.id === id);
      if (ix === -1) return { success: false };
      setNodeList(nodeList.filter((n) => n.id !== id));
      return { success: true };
    },
    nodeHighlight,
    textHighlight,
    spellCheck,
  };

  return (
    <div className="tree-of-nodes">
      <TreeOfNodesContext.Provider value={contextValue}>
        <TreeNode
          id={nodeId}
          canRemove={canRemove}
          canRename={canRename}
          canAddChildren={canAddChildren}
          canRemoveChildren={canRemoveChildren}
          canRenameChildren={canRenameChildren}
        />
      </TreeOfNodesContext.Provider>
    </div>
  );
};

const meta = {
  title: "Components/TreeNode",
  component: TreeNode,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TreeNode>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic root node
export const BasicRoot: Story = {
  render: () => <TreeNodeWithContext nodeId={0} />,
  args: {
    id: 0,
  },
};

// Node with children
export const WithChildren: Story = {
  render: () => <TreeNodeWithContext nodeId={0} />,
  args: {
    id: 0,
  },
};

// Leaf node (no children)
export const LeafNode: Story = {
  render: () => <TreeNodeWithContext nodeId={2} />,
  args: {
    id: 2,
  },
};

// Node with long label
export const LongLabel: Story = {
  render: () => <TreeNodeWithContext nodeId="Z" />,
  args: {
    id: "Z",
  },
};

// With checkbox
export const WithCheckbox: Story = {
  render: () => (
    <TreeNodeWithContext
      nodeId={0}
      showCheckBox
    />
  ),
  args: {
    id: 0,
  },
};

// Fully editable node
export const Editable: Story = {
  render: () => (
    <TreeNodeWithContext
      nodeId={0}
      canRemove
      canRename
      canAddChildren
      canRemoveChildren
      canRenameChildren
    />
  ),
  args: {
    id: 0,
    canRemove: true,
    canRename: true,
    canAddChildren: true,
    canRemoveChildren: true,
    canRenameChildren: true,
  },
};

// Custom highlighting
export const CustomHighlighting: Story = {
  render: () => (
    <TreeNodeWithContext
      nodeId={0}
      nodeHighlight="blue"
      textHighlight="rgba(0,255,0,0.4)"
    />
  ),
  args: {
    id: 0,
  },
};

// With spell check disabled
export const SpellCheckDisabled: Story = {
  render: () => (
    <TreeNodeWithContext
      nodeId={0}
      canRename
      canRenameChildren
      spellCheck="false"
    />
  ),
  args: {
    id: 0,
    canRename: true,
    canRenameChildren: true,
  },
};
