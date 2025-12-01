import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { WordEntry } from "./WordEntry";

const meta = {
  title: "Components/WordEntry",
  component: WordEntry,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof WordEntry>;

export default meta;
type Story = StoryObj<typeof meta>;

// Read-only display mode
export const ReadOnly: Story = {
  args: {
    id: "readonly-entry",
    value: "This is a read-only text entry",
    editing: false,
  },
};

// Empty value display
export const Empty: Story = {
  args: {
    id: "empty-entry",
    value: "",
    editing: false,
  },
};

// Editing mode
export const Editing: Story = {
  args: {
    id: "editing-entry",
    value: "Edit this text",
    editing: true,
  },
};

// Saving state (with spinner)
export const Saving: Story = {
  args: {
    id: "saving-entry",
    value: "Saving...",
    editing: true,
    saving: true,
  },
};

// With spell check disabled
export const SpellCheckDisabled: Story = {
  args: {
    id: "spellcheck-disabled",
    value: "Teh spellcheker is dsabled",
    editing: true,
    spellCheck: "false",
  },
};

// With spell check enabled
export const SpellCheckEnabled: Story = {
  args: {
    id: "spellcheck-enabled",
    value: "Teh spellcheker is enabled",
    editing: true,
    spellCheck: "true",
  },
};

// With custom styling
export const CustomStyled: Story = {
  args: {
    id: "styled-entry",
    value: "Custom styled entry",
    editing: false,
    style: {
      backgroundColor: "rgba(0,255,0,0.2)",
      border: "1px solid green",
      padding: "4px 8px",
      borderRadius: "4px",
    },
  },
};

// Interactive example that demonstrates toggling between edit and display mode
const InteractiveWordEntryComponent = () => {
  const [value, setValue] = useState<string>("Double-click to edit");
  const [editing, setEditing] = useState<boolean>(false);

  return (
    <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "4px", width: "300px" }}>
      <h4 style={{ marginBottom: "1rem" }}>Interactive Word Entry</h4>
      <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem" }}>
        Double-click to edit. Press Enter to save, Escape to cancel.
      </p>
      <div
        onDoubleClick={() => setEditing(true)}
        style={{ minHeight: "30px" }}
      >
        <WordEntry
          id="interactive-entry"
          value={value}
          editing={editing}
          setValue={(newValue) => {
            setValue(newValue);
            setEditing(false);
          }}
          sendEscape={() => setEditing(false)}
        />
      </div>
      <div style={{ marginTop: "1rem", padding: "8px", backgroundColor: "#f0f0f0" }}>
        <strong>Current value:</strong> {value}
      </div>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveWordEntryComponent />,
  args: {
    id: "interactive-entry",
    value: "Double-click to edit",
  },
};

// With className
export const WithClassName: Story = {
  args: {
    id: "classname-entry",
    value: "Entry with custom class",
    editing: false,
    className: "selected",
  },
};
