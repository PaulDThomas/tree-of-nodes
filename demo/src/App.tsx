import { Key, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { TreeNodeData, TreeOfNodes } from "../../src/main";
import { mockNodes } from "../../src/__mocks__/mockNodes";

export const App = () => {
  const [nodeList, setNodeList] =
    useState<TreeNodeData<{ value: number } | number | undefined>[]>(mockNodes);
  const [selected, setSelected] = useState<Key[]>([2]);

  const [usingCheckBoxes, setusingCheckBoxes] = useState<boolean>(true);
  const [usingSpellCheck, setusingSpellCheck] = useState<boolean>(true);

  return (
    <Container>
      <Row
        style={{
          margin: "1rem",
          border: "1px solid black",
          borderRadius: "4px",
          backgroundColor: "white",
        }}
      >
        <Col
          sm={12}
          style={{ height: "600px" }}
        >
          <h4>Tree of nodes</h4>
          <div
            style={{
              border: "1px dashed black",
              padding: "4px",
              marginBottom: "8px",
              borderRadius: "3px",
            }}
          >
            <input
              type="checkbox"
              checked={usingCheckBoxes}
              onChange={(e) => setusingCheckBoxes(e.currentTarget.checked)}
            />{" "}
            Use checkboxes?
            <input
              type="checkbox"
              checked={usingSpellCheck}
              onChange={(e) => setusingSpellCheck(e.currentTarget.checked)}
              style={{ marginLeft: "12px" }}
            />{" "}
            Use spell check?
          </div>
          <TreeOfNodes<{ value: number } | number | undefined>
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
        </Col>
      </Row>
    </Container>
  );
};

export default App;
