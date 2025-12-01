import type { StoryObj } from "@storybook/react-vite";
import { Key, useEffect, useState } from "react";
import { useArgs } from "storybook/internal/preview-api";
import { mockNodes } from "../__mocks__/mockNodes";
import { TreeNodeData } from "./interface";
import "./TreeNode.css";
import { TreeOfNodes } from "./TreeOfNodes";

const meta = {
  title: "Components/TreeOfNodes",
  component: TreeOfNodes,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic example with minimal configuration
export const Basic: Story = {
  args: {
    id: "basic-tree",
    nodeList: mockNodes,
    roots: [0, "X"],
  },
};

// Example with checkboxes enabled
export const WithCheckboxes: Story = {
  render: function WithCheckboxesStory() {
    const [args, updateArgs] = useArgs();
    return (
      <TreeOfNodes<{ value: number } | string | number | undefined>
        id={args.id}
        nodeList={args.nodeList || mockNodes}
        roots={args.roots || [0, "X"]}
        showCheckBox={args.showCheckBox}
        selected={args.selected}
        handleSelect={(i: Key | Key[]) => {
          if (Array.isArray(i)) {
            const selected = (args.selected as Key[]) || [];
            updateArgs({
              selected: selected.includes(i[0])
                ? selected.filter((s: Key) => !i.includes(s))
                : [...selected, ...i.filter((n: Key) => !selected.includes(n))],
            });
          } else {
            const selected = (args.selected as Key[]) || [];
            updateArgs({
              selected: selected.includes(i)
                ? selected.filter((s: Key) => s !== i)
                : [...selected, i],
            });
          }
        }}
      />
    );
  },
  args: {
    id: "checkbox-tree",
    nodeList: mockNodes,
    roots: [0, "X"],
    showCheckBox: true,
    selected: [2],
  },
};

// Example with custom highlighting colors
export const CustomHighlighting: Story = {
  render: function CustomHighlightingStory() {
    const [args, updateArgs] = useArgs();
    return (
      <TreeOfNodes<{ value: number } | string | number | undefined>
        id={args.id}
        nodeList={args.nodeList || mockNodes}
        roots={args.roots || [0, "X"]}
        nodeHighlight={args.nodeHighlight}
        textHighlight={args.textHighlight}
        selected={args.selected}
        handleSelect={(i: Key | Key[]) => {
          updateArgs({ selected: Array.isArray(i) ? i : [i] });
        }}
      />
    );
  },
  args: {
    id: "highlight-tree",
    nodeList: mockNodes,
    roots: [0, "X"],
    nodeHighlight: "blue",
    textHighlight: "rgba(0,255,0,0.4)",
    selected: [2],
  },
};

// Example with all CRUD operations enabled
export const FullyEditable: Story = {
  render: function FullyEditableStory() {
    const [args, updateArgs] = useArgs();
    const nodeList =
      (args.nodeList as TreeNodeData<{ value: number } | string | number | undefined>[]) ||
      mockNodes;

    return (
      <TreeOfNodes<{ value: number } | string | number | undefined>
        id={args.id}
        nodeList={nodeList}
        roots={args.roots || [0, "X"]}
        canAddChildren={args.canAddChildren}
        canRemoveChildren={args.canRemoveChildren}
        canRenameChildren={args.canRenameChildren}
        canRenameRoot={args.canRenameRoot}
        canRemoveRoot={args.canRemoveRoot}
        onAdd={async (p, n) => {
          const newId =
            (Math.max(
              ...nodeList
                .filter(
                  (node: TreeNodeData<{ value: number } | string | number | undefined>) =>
                    typeof node.id === "number",
                )
                .map(
                  (node: TreeNodeData<{ value: number } | string | number | undefined>) =>
                    node.id as number,
                ),
            ) ?? 0) + 1;
          updateArgs({
            nodeList: [...nodeList, { id: newId, parentId: p, label: n, data: newId }],
          });
          return { success: true };
        }}
        onRename={async (i, n) => {
          const ix = nodeList.findIndex(
            (node: TreeNodeData<{ value: number } | string | number | undefined>) => node.id === i,
          );
          if (ix === -1) return { success: false };
          const newNodes = [...nodeList];
          newNodes.splice(ix, 1, { ...nodeList[ix], label: n });
          updateArgs({ nodeList: newNodes });
          return { success: true };
        }}
        onRemove={async (i) => {
          const ix = nodeList.findIndex(
            (node: TreeNodeData<{ value: number } | string | number | undefined>) => node.id === i,
          );
          if (ix === -1) return { success: false };
          const newNodes = [...nodeList];
          newNodes.splice(ix, 1);
          updateArgs({ nodeList: newNodes });
          return { success: true };
        }}
      />
    );
  },
  args: {
    id: "editable-tree",
    nodeList: mockNodes,
    roots: [0, "X"],
    canAddChildren: true,
    canRemoveChildren: true,
    canRenameChildren: true,
    canRenameRoot: true,
    canRemoveRoot: true,
  },
};

// Example with spell check disabled
export const SpellCheckDisabled: Story = {
  render: function SpellCheckDisabledStory() {
    const [args, updateArgs] = useArgs();
    const nodeList =
      (args.nodeList as TreeNodeData<{ value: number } | string | number | undefined>[]) ||
      mockNodes;

    return (
      <TreeOfNodes<{ value: number } | string | number | undefined>
        id={args.id}
        nodeList={nodeList}
        roots={args.roots || [0, "X"]}
        canRenameChildren={args.canRenameChildren}
        canRenameRoot={args.canRenameRoot}
        spellCheck={args.spellCheck}
        onRename={async (i, n) => {
          const ix = nodeList.findIndex(
            (node: TreeNodeData<{ value: number } | string | number | undefined>) => node.id === i,
          );
          if (ix === -1) return { success: false };
          const newNodes = [...nodeList];
          newNodes.splice(ix, 1, { ...nodeList[ix], label: n });
          updateArgs({ nodeList: newNodes });
          return { success: true };
        }}
      />
    );
  },
  args: {
    id: "spellcheck-tree",
    nodeList: mockNodes,
    roots: [0, "X"],
    canRenameChildren: true,
    canRenameRoot: true,
    spellCheck: "false",
  },
};

// Example with single root
export const SingleRoot: Story = {
  args: {
    id: "single-root-tree",
    nodeList: mockNodes,
    roots: [0],
  },
};

// Example with lazy-loaded children (click on "Ex" -> "Zed..." to see dynamic children), state retained with useArgs
export const LazyLoadedChildren: Story = {
  render: function LazyLoadedChildrenStory() {
    const [storyArgs, setStoryArgs] = useArgs();
    const { nodeList = mockNodes, selected = [] } = storyArgs as {
      nodeList: TreeNodeData<{ value: number } | string | number | undefined>[];
      selected: Key[];
    };
    const [hasLoadedZ, setHasLoadedZ] = useState(false);

    useEffect(() => {
      if (!hasLoadedZ && selected.includes("Z")) {
        const newNodes: TreeNodeData<string>[] = [
          { id: "ZA", parentId: "Z", label: "Hear no evil", data: "ears" },
          { id: "ZB", parentId: "Z", label: "See no evil", data: "eyes" },
          { id: "ZC", parentId: "Z", label: "Speak no evil", data: "mouth" },
        ];
        setStoryArgs({ nodeList: [...nodeList, ...newNodes] });
        setHasLoadedZ(true);
      }
    }, [hasLoadedZ, selected, nodeList, setStoryArgs]);

    return (
      <div style={{ padding: "1rem", border: "1px solid black", borderRadius: "4px" }}>
        <h4>Lazy-Loaded Children</h4>
        <p style={{ fontSize: "0.9rem", color: "#666" }}>
          Click on &quot;Ex&quot; and then &quot;Zed...&quot; to load additional children
          dynamically.
        </p>
        <TreeOfNodes<{ value: number } | string | number | undefined>
          id={"lazy-tree"}
          nodeList={nodeList}
          roots={["X"]}
          selected={selected}
          handleSelect={(i: Key | Key[]) => {
            if (Array.isArray(i)) {
              setStoryArgs({ selected: i });
            } else {
              setStoryArgs({ selected: [i] });
            }
          }}
        />
      </div>
    );
  },
  args: {
    id: "lazy-tree",
    nodeList: mockNodes,
    roots: ["X"],
    selected: [],
  },
};
