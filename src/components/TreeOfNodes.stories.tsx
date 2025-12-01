import type { Meta, StoryObj } from "@storybook/react-vite";
import { Key, useEffect, useState } from "react";
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
} satisfies Meta<typeof TreeOfNodes>;

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

// Interactive example matching the demo app
const InteractiveTreeComponent = () => {
  const [nodeList, setNodeList] =
    useState<TreeNodeData<{ value: number } | string | number | undefined>[]>(mockNodes);
  const [selected, setSelected] = useState<Key[]>([2]);
  const [usingCheckBoxes, setUsingCheckBoxes] = useState<boolean>(true);
  const [usingSpellCheck, setUsingSpellCheck] = useState<boolean>(true);
  const [addSlow, setAddSlow] = useState<boolean>(false);

  useEffect(() => {
    if (!addSlow && selected.includes("Z")) {
      const newNodes: TreeNodeData<string>[] = [
        { id: "ZA", parentId: "Z", label: "Hear no evil", data: "ears" },
        { id: "ZB", parentId: "Z", label: "See no evil", data: "eyes" },
        { id: "ZC", parentId: "Z", label: "Speak no evil", data: "mouth" },
      ];
      setNodeList((prev) => [...prev, ...newNodes]);
      setAddSlow(true);
    }
  }, [addSlow, selected]);

  return (
    <div style={{ padding: "1rem", border: "1px solid black", borderRadius: "4px" }}>
      <h4>Interactive Tree of Nodes</h4>
      <div
        style={{
          border: "1px dashed black",
          padding: "4px",
          marginBottom: "8px",
          borderRadius: "3px",
        }}
      >
        <input
          id="use-checkboxes"
          type="checkbox"
          checked={usingCheckBoxes}
          onChange={(e) => setUsingCheckBoxes(e.currentTarget.checked)}
        />{" "}
        Use checkboxes?
        <input
          id="use-spellcheck"
          type="checkbox"
          checked={usingSpellCheck}
          onChange={(e) => setUsingSpellCheck(e.currentTarget.checked)}
          style={{ marginLeft: "12px" }}
        />{" "}
        Use spell check?
      </div>
      <TreeOfNodes<{ value: number } | string | number | undefined>
        id={"node-tree"}
        nodeList={nodeList}
        roots={[0, "X"]}
        canAddChildren
        canRemoveChildren
        canRenameChildren
        canRenameRoot
        canRemoveRoot
        nodeHighlight="blue"
        textHighlight="rgba(0,255,0,0.4)"
        showCheckBox={usingCheckBoxes}
        selected={selected}
        spellCheck={usingSpellCheck ? "true" : "false"}
        handleSelect={async (i) => {
          if (usingCheckBoxes) {
            if (Array.isArray(i)) {
              setSelected(
                selected.includes(i[0])
                  ? selected.filter((s) => !i.includes(s))
                  : [...selected, ...i.filter((n) => !selected.includes(n))],
              );
            } else {
              setSelected(
                selected.includes(i) ? selected.filter((s) => s !== i) : [...selected, i],
              );
            }
          } else {
            setSelected([i as Key]);
          }
        }}
        onAdd={async (p, n) => {
          const newId =
            (Math.max(
              ...nodeList.filter((n) => typeof n.id === "number").map((n) => n.id as number),
            ) ?? 0) + 1;
          setNodeList([...nodeList, { id: newId, parentId: p, label: n, data: newId }]);
          return { success: true };
        }}
        onRename={async (i, n) => {
          const ix = nodeList.findIndex((n) => n.id === i);
          if (ix === -1) return { success: false };
          const newNodes = [...nodeList];
          newNodes.splice(ix, 1, { ...nodeList[ix], label: n });
          setNodeList(newNodes);
          return { success: true };
        }}
        onRemove={async (i) => {
          const ix = nodeList.findIndex((n) => n.id === i);
          if (ix === -1) return { success: false };
          const newNodes = [...nodeList];
          newNodes.splice(ix, 1);
          setNodeList(newNodes);
          return { success: true };
        }}
      />
      <div style={{ marginTop: "1rem", padding: "8px", backgroundColor: "#f0f0f0" }}>
        <strong>Selected IDs:</strong> {selected.join(", ")}
      </div>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveTreeComponent />,
  args: {
    id: "interactive-tree",
    nodeList: mockNodes,
    roots: [0, "X"],
  },
};

// Example with spell check disabled
export const SpellCheckDisabled: Story = {
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

// Example with lazy-loaded children (click on "Ex" -> "Zed..." to see dynamic children)
const LazyLoadComponent = () => {
  const [nodeList, setNodeList] =
    useState<TreeNodeData<{ value: number } | string | number | undefined>[]>(mockNodes);
  const [selected, setSelected] = useState<Key[]>([]);
  const [hasLoadedZ, setHasLoadedZ] = useState<boolean>(false);

  useEffect(() => {
    if (!hasLoadedZ && selected.includes("Z")) {
      const newNodes: TreeNodeData<string>[] = [
        { id: "ZA", parentId: "Z", label: "Hear no evil", data: "ears" },
        { id: "ZB", parentId: "Z", label: "See no evil", data: "eyes" },
        { id: "ZC", parentId: "Z", label: "Speak no evil", data: "mouth" },
      ];
      setNodeList((prev) => [...prev, ...newNodes]);
      setHasLoadedZ(true);
    }
  }, [hasLoadedZ, selected]);

  return (
    <div style={{ padding: "1rem", border: "1px solid black", borderRadius: "4px" }}>
      <h4>Lazy-Loaded Children</h4>
      <p style={{ fontSize: "0.9rem", color: "#666" }}>
        Click on &quot;Ex&quot; and then &quot;Zed...&quot; to load additional children dynamically.
      </p>
      <TreeOfNodes<{ value: number } | string | number | undefined>
        id={"lazy-tree"}
        nodeList={nodeList}
        roots={["X"]}
        selected={selected}
        handleSelect={(i) => {
          if (Array.isArray(i)) {
            setSelected(i);
          } else {
            setSelected([i]);
          }
        }}
      />
    </div>
  );
};

export const LazyLoadedChildren: Story = {
  render: () => <LazyLoadComponent />,
  args: {
    id: "lazy-tree",
    nodeList: mockNodes,
    roots: ["X"],
  },
};
