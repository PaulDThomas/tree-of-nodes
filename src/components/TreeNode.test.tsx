import { act, fireEvent, queryByAttribute, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TreeNode } from "./TreeNode";
import { TreeOfNodesContext } from "./TreeOfNodesContext";
import { mockNodes } from "../__mocks__/mockNodes";

const getById = queryByAttribute.bind(null, "id");

describe("TreeNode", () => {
  test("Empty render", async () => {
    await act(async () => {
      render(
        <div data-testid="container">
          <TreeNode id={"test"} />
        </div>,
      );
    });
    const container = screen.queryByTestId("container") as HTMLDivElement;
    const tn = container.querySelector("#ton-treenode-test") as HTMLElement;
    expect(tn).not.toBeInTheDocument();
  });

  test("Render with context", async () => {
    const { container } = await act(async () =>
      render(
        <TreeOfNodesContext.Provider
          value={{
            id: "test-tree",
            nodeList: mockNodes,
            selected: [],
            expandedNodes: [],
            handleSelect: jest.fn(),
            handleExpandClick: jest.fn(),
            nodeHighlight: "black",
            textHighlight: "lightgrey",
            showCheckBox: false,
          }}
        >
          <TreeNode id={0} />
        </TreeOfNodesContext.Provider>,
      ),
    );
    const tn = container.querySelector("#test-tree-treenode-0") as HTMLElement;
    expect(tn).toBeInTheDocument();
    const check = screen.queryByRole("checkbox");
    expect(check).not.toBeInTheDocument();
  });

  test("Context menu actions, nowt", async () => {
    const user = userEvent.setup();
    const mockRename = jest.fn(async () => {
      return { success: true };
    });
    await act(async () =>
      render(
        <TreeOfNodesContext.Provider
          value={{
            id: "test-tree",
            nodeList: mockNodes,
            selected: [],
            expandedNodes: mockNodes.map((n) => n.id),
            onRename: mockRename,
            handleSelect: jest.fn(),
            handleExpandClick: jest.fn(),
            nodeHighlight: "black",
            textHighlight: "lightgrey",
            showCheckBox: false,
          }}
        >
          <TreeNode
            id={0}
            canRename={true}
          />
        </TreeOfNodesContext.Provider>,
      ),
    );
    const we = screen.getByText("Root");
    expect(we).toBeInTheDocument();
    await act(async () => {
      fireEvent.contextMenu(we);
    });
    const ren = screen.getByText("Rename");
    expect(ren).toBeInTheDocument();
    const child = screen.getByText("One.Four");
    expect(child).toBeInTheDocument();
    await user.click(child);
  });

  test("Context menu actions, rename + escape", async () => {
    const user = userEvent.setup({ delay: null });
    const mockRename = jest.fn(async () => {
      return { success: true };
    });
    const { container } = await act(async () =>
      render(
        <TreeOfNodesContext.Provider
          value={{
            id: "test-tree",
            nodeList: mockNodes,
            selected: [],
            expandedNodes: mockNodes.map((n) => n.id),
            onRename: mockRename,
            handleSelect: jest.fn(),
            handleExpandClick: jest.fn(),
            nodeHighlight: "black",
            textHighlight: "lightgrey",
            showCheckBox: false,
          }}
        >
          <TreeNode
            id={0}
            canRename={true}
          />
        </TreeOfNodesContext.Provider>,
      ),
    );
    const we = screen.queryByText("Root") as HTMLElement;
    expect(we).toBeInTheDocument();
    await act(async () => {
      fireEvent.contextMenu(we);
    });
    const ren = screen.getByText("Rename");
    expect(ren).toBeInTheDocument();
    await user.click(ren);

    const rootInput = getById(container, "test-tree-treenode-entry-0");
    expect(rootInput).toBeInTheDocument();
    expect(rootInput?.tagName).toEqual("INPUT");
    await user.clear(rootInput as HTMLInputElement);
    await user.type(rootInput as HTMLInputElement, "new name");
    await user.keyboard("{Escape}");
    expect(screen.queryByText("new name")).not.toBeInTheDocument();
    expect(mockRename).not.toHaveBeenCalled();

    const we2 = screen.getByText("Root");
    expect(we2).toBeInTheDocument();
    await act(async () => {
      fireEvent.contextMenu(we2);
    });
    const ren2 = screen.queryByText("Rename");
    expect(ren2).toBeInTheDocument();
    await user.click(ren2!);
    const rootInput2 = getById(container, "test-tree-treenode-entry-0");
    expect(rootInput2).toBeInTheDocument();
    expect(rootInput2?.tagName).toEqual("INPUT");
    await user.clear(rootInput2 as HTMLInputElement);
    await user.type(rootInput2 as HTMLInputElement, "new name");
    await act(async () => {
      fireEvent.blur(rootInput2 as HTMLInputElement);
    });
    expect(mockRename).toHaveBeenCalledWith(0, "new name");
  });

  test("Context menu actions, remove", async () => {
    const user = userEvent.setup();
    const mockRemove = jest.fn(async () => {
      return { success: false };
    });
    await act(async () =>
      render(
        <TreeOfNodesContext.Provider
          value={{
            id: "test-tree",
            nodeList: mockNodes,
            expandedNodes: mockNodes.map((n) => n.id),
            onRemove: mockRemove,
            selected: [4],
            handleSelect: jest.fn(),
            handleExpandClick: jest.fn(),
            nodeHighlight: "black",
            textHighlight: "lightgrey",
            showCheckBox: false,
          }}
        >
          <TreeNode
            id={4}
            canRemove={true}
          />
        </TreeOfNodesContext.Provider>,
      ),
    );
    const we = screen.getByText("One.Four");
    expect(we).toBeInTheDocument();
    await act(async () => {
      fireEvent.contextMenu(we);
    });
    const del = screen.getByText("Delete");
    expect(del).toBeInTheDocument();
    await user.click(del);
    expect(screen.getByText("An unknown error has occured")).toBeInTheDocument();
  });

  test("Context menu actions, add, no escape", async () => {
    const user = userEvent.setup();
    const mockAdd = jest.fn(async () => {
      return { success: true };
    });
    const mockSelect = jest.fn();
    const mockExpand = jest.fn();
    const { container } = await act(async () =>
      render(
        <TreeOfNodesContext.Provider
          value={{
            id: "test-tree",
            nodeList: mockNodes,
            selected: [4],
            expandedNodes: mockNodes.map((n) => n.id),
            onAddChild: mockAdd,
            handleSelect: mockSelect,
            handleExpandClick: mockExpand,
            nodeHighlight: "black",
            textHighlight: "lightgrey",
            showCheckBox: false,
          }}
        >
          <TreeNode
            id={4}
            canAddChildren={true}
          />
        </TreeOfNodesContext.Provider>,
      ),
    );
    const we = screen.getByText("One.Four");
    expect(we).toBeInTheDocument();
    await act(async () => {
      fireEvent.contextMenu(we);
    });
    expect(mockSelect).toHaveBeenCalled();
    const add = screen.getByText("Add");
    expect(add).toBeInTheDocument();
    await user.click(add);
    const newNode = getById(container, "treenode-new-4");
    expect(newNode?.tagName).toEqual("INPUT");
    await user.clear(newNode as HTMLInputElement);
    await user.type(newNode as HTMLInputElement, "new name");
    await act(async () => {
      fireEvent.blur(newNode as HTMLInputElement);
    });
    expect(mockAdd).toHaveBeenCalledWith(4, "new name");
    expect(mockExpand).toHaveBeenCalled();
  });

  test("Context menu actions, add + escape", async () => {
    const user = userEvent.setup();
    const mockAdd = jest.fn(async () => {
      return { success: true };
    });
    const mockSelect = jest.fn();
    const mockExpand = jest.fn();
    const { container } = await act(async () =>
      render(
        <TreeOfNodesContext.Provider
          value={{
            id: "test-tree",
            nodeList: mockNodes,
            selected: [4],
            expandedNodes: mockNodes.map((n) => n.id),
            onAddChild: mockAdd,
            handleSelect: mockSelect,
            handleExpandClick: mockExpand,
            nodeHighlight: "black",
            textHighlight: "lightgrey",
            showCheckBox: true,
          }}
        >
          <TreeNode
            id={4}
            canAddChildren={true}
          />
        </TreeOfNodesContext.Provider>,
      ),
    );
    const dis = screen.queryByLabelText("Disabled expander") as Element;
    expect(dis).toBeInTheDocument();
    await user.click(dis);
    expect(mockSelect).toHaveBeenCalledWith(4);

    const we = screen.getByText("One.Four");
    expect(we).toBeInTheDocument();
    await act(async () => {
      fireEvent.contextMenu(we);
    });
    expect(mockSelect).toHaveBeenCalled();
    const add = screen.getByText("Add");
    expect(add).toBeInTheDocument();
    await user.click(add);
    const newNode = getById(container, "treenode-new-4");
    expect(newNode?.tagName).toEqual("INPUT");
    await user.clear(newNode as HTMLInputElement);
    await user.type(newNode as HTMLInputElement, "new name");
    await user.keyboard("{Escape}");
    expect(mockAdd).not.toHaveBeenCalledWith(4, "new name");
    expect(newNode).not.toBeInTheDocument();
  });

  test("Check with children hidden, unselected", async () => {
    const user = userEvent.setup();
    const mockAdd = jest.fn(async () => {
      return { success: true };
    });
    const mockSelect = jest.fn();
    const mockExpand = jest.fn();
    await act(async () => {
      render(
        <TreeOfNodesContext.Provider
          value={{
            id: "test-tree",
            nodeList: mockNodes,
            selected: [],
            expandedNodes: [],
            onAddChild: mockAdd,
            handleSelect: mockSelect,
            handleExpandClick: mockExpand,
            nodeHighlight: "black",
            textHighlight: "lightgrey",
            showCheckBox: true,
          }}
        >
          <div data-testid="container">
            <TreeNode
              id={1}
              canAddChildren={true}
            />
          </div>
        </TreeOfNodesContext.Provider>,
      );
    });
    // Click on checkbox
    const check = screen.queryAllByRole("checkbox")[0] as HTMLInputElement;
    expect(check).toBeInTheDocument();
    expect(check.checked).toEqual(false);
    await user.click(check);
    expect(mockSelect).toHaveBeenCalledWith([1, 2, 3, 4]);
    // Click on expander
    const exp = screen.queryByLabelText("Expander") as Element;
    expect(exp).toBeInTheDocument();
    await user.click(exp);
    expect(mockExpand).toHaveBeenCalledWith(1);
  });

  test("Check with children shown, selected", async () => {
    const user = userEvent.setup();
    const mockAdd = jest.fn(async () => {
      return { success: true };
    });
    const mockSelect = jest.fn();
    const mockExpand = jest.fn();
    await act(async () => {
      render(
        <TreeOfNodesContext.Provider
          value={{
            id: "test-tree",
            nodeList: mockNodes,
            selected: [4],
            expandedNodes: [1],
            onAddChild: mockAdd,
            handleSelect: mockSelect,
            handleExpandClick: mockExpand,
            nodeHighlight: "black",
            textHighlight: "lightgrey",
            showCheckBox: true,
          }}
        >
          <div data-testid="container">
            <TreeNode
              id={1}
              canAddChildren={true}
            />
          </div>
        </TreeOfNodesContext.Provider>,
      );
    });
    // Click on checkbox
    const check = screen.queryAllByRole("checkbox") as HTMLInputElement[];
    expect(check[0]).toBeInTheDocument();
    expect(check[0].checked).toEqual(false);
    expect(check[0].indeterminate).toEqual(true);
    await user.click(check[0]);
    expect(mockSelect).toHaveBeenCalledWith([1, 2, 3, 4]);
    // Click on expander
    const exp = screen.queryByLabelText("Expander") as Element;
    expect(exp).toBeInTheDocument();
    await user.click(exp);
    expect(mockExpand).toHaveBeenCalledWith(1);
  });
});
