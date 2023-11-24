import { ContextMenuHandler, iMenuItem } from "@asup/context-menu";
import { Key, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  CaretDownFill,
  CaretRight,
  CaretRightFill,
  ExclamationCircleFill,
} from "react-bootstrap-icons";
import { getAncestors } from "../functions/getAncestors";
import { getDescendentIds } from "../functions/getDescendentIds";
import "./TreeNode.css";
import { TreeOfNodesContext } from "./TreeOfNodesContext";
import { WordEntry } from "./WordEntry";
import { iNodeUpdate } from "./interface";

interface TreeNodeProps {
  id: Key;
  indentLevel?: number;
  canRemove?: boolean;
  canRename?: boolean;
  canAddChildren?: boolean;
  canRemoveChildren?: boolean;
  canRenameChildren?: boolean;
  refresh?: () => void;
}

export const TreeNode = ({
  id,
  canRemove,
  canRename,
  canAddChildren,
  canRemoveChildren,
  canRenameChildren,
}: TreeNodeProps): JSX.Element => {
  // Contexts
  const treeContext = useContext(TreeOfNodesContext);

  // Node information
  const thisNode = useMemo(
    () => treeContext?.nodeList.find((n) => n.id === id),
    [id, treeContext?.nodeList],
  );
  const childNodes = useMemo(
    () => treeContext?.nodeList.filter((n) => n.parentId === id),
    [id, treeContext?.nodeList],
  );
  const descendents = useMemo(
    () => getDescendentIds(id, treeContext?.nodeList ?? []),
    [id, treeContext],
  );

  // State
  const [error, setError] = useState<boolean>(false);
  const [errorText, setErrotText] = useState<string>("");
  const expanded = useMemo(() => {
    return (treeContext?.expandedNodes.findIndex((e) => e === id) ?? -1) > -1;
  }, [id, treeContext?.expandedNodes]);

  // Checkbox
  const checkRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (checkRef.current) {
      if (treeContext?.selected.includes(id)) {
        checkRef.current.checked = true;
        checkRef.current.indeterminate = false;
      } else if (descendents.some((d) => treeContext?.selected.includes(d))) {
        checkRef.current.checked = false;
        checkRef.current.indeterminate = true;
      } else {
        checkRef.current.checked = false;
        checkRef.current.indeterminate = false;
      }
    }
  }, [descendents, id, treeContext?.selected]);

  // Apply selected border
  const currentBorder = useMemo<string>(() => {
    return treeContext?.selected.includes(id) ? "1px solid black" : "";
  }, [id, treeContext?.selected]);
  const nodeColour = useMemo<string | undefined>(() => {
    if (treeContext && treeContext.selected) {
      const anc = getAncestors(treeContext.selected, [], treeContext?.nodeList).map((n) => n.id);
      if ([...anc, treeContext.selected].includes(id)) return treeContext.nodeHighlight;
    }
    return;
  }, [id, treeContext]);

  // New node parameters
  const newNameRef = useRef<HTMLInputElement | null>(null);
  const [showNewNode, setShowNewNode] = useState<boolean>(false);
  const [savingNewNode, setSavingNewNode] = useState<boolean>(false);

  // Rename parameters
  const currentNameRef = useRef<HTMLInputElement | null>(null);
  const [renaming, setRenaming] = useState<boolean>(false);
  const [updatingNode, setUpdatingNode] = useState<boolean>(false);

  // Context functions
  const handleReturn = useCallback((ret: iNodeUpdate) => {
    if (!ret.success) {
      setError(true);
      setErrotText(ret.ErrorText ?? "An unknown error has occured");
    } else {
      setError(false);
      setErrotText("");
    }
  }, []);

  const confirmNewNode = useCallback(
    async (label: string) => {
      setSavingNewNode(true);
      if (treeContext?.onAddChild) {
        handleReturn(await treeContext.onAddChild(id, label));
      }
      setSavingNewNode(false);
      setShowNewNode(false);
    },
    [handleReturn, id, treeContext],
  );

  const renameNode = useCallback(
    async (newLabel: string) => {
      setRenaming(false);
      if (treeContext?.onRename) {
        setUpdatingNode(true);
        handleReturn(await treeContext.onRename(id, newLabel));
        setUpdatingNode(false);
      }
    },
    [handleReturn, id, treeContext],
  );

  const deleteThis = useCallback(async () => {
    if (treeContext?.onRemove) {
      setUpdatingNode(true);
      handleReturn(await treeContext.onRemove(id));
      setUpdatingNode(false);
    }
  }, [handleReturn, id, treeContext]);

  // Context actions
  const addChild = useCallback(() => {
    setShowNewNode(true);
    treeContext && treeContext.handleExpandClick(id, true);
  }, [id, treeContext]);
  useEffect(() => {
    if (showNewNode === true && newNameRef.current) newNameRef.current.focus();
  }, [showNewNode]);
  const renameThis = useCallback(() => {
    setRenaming(true);
    treeContext && treeContext.handleSelect && treeContext.handleSelect(id);
  }, [id, treeContext]);

  // Context menu
  const menuItems = useMemo(() => {
    const menuItems: iMenuItem[] = [];
    if (canAddChildren) {
      menuItems.push({ label: "Add", action: addChild });
    }
    if (canRename) {
      menuItems.push({ label: "Rename", action: renameThis });
    }
    if (canRemove && (childNodes === undefined || childNodes.length === 0)) {
      menuItems.push({ label: "Delete", action: deleteThis });
    }
    return menuItems;
  }, [addChild, canAddChildren, canRemove, canRename, childNodes, deleteThis, renameThis]);

  // Return node
  if (!treeContext) return <></>;
  return (
    <ContextMenuHandler menuItems={menuItems}>
      <div
        id={`${treeContext.id}-treenode-${id}`}
        className="treenode"
      >
        {error ? (
          <>
            <ExclamationCircleFill color="var(--bs-danger)" /> {errorText}
          </>
        ) : (
          <div className="ton-node">
            {treeContext.showCheckBox && (
              <input
                ref={checkRef}
                type="checkbox"
                role="checkbox"
                className="ton-checkbox"
                id={`${treeContext.id}-treenode-checkbox-${id}`}
                onClick={() => {
                  treeContext.handleSelect && treeContext.handleSelect(descendents);
                }}
              />
            )}
            {childNodes !== undefined && childNodes.length > 0 ? (
              !expanded ? (
                <CaretRightFill
                  id={`${treeContext.id}-treenode-caret-${id}`}
                  className="ton-expander"
                  role="button"
                  color={nodeColour}
                  aria-expanded={false}
                  aria-label="Expander"
                  onClick={() => treeContext.handleExpandClick(id)}
                />
              ) : (
                <CaretDownFill
                  id={`${treeContext.id}-treenode-caret-${id}`}
                  className="ton-expander"
                  role="button"
                  aria-expanded={true}
                  aria-label="Expander"
                  color={nodeColour}
                  onClick={() => {
                    treeContext.handleExpandClick(id);
                  }}
                />
              )
            ) : (
              <CaretRight
                id={`${treeContext.id}-treenode-caret-${id}`}
                className="ton-expander"
                role="button"
                color={nodeColour}
                aria-expanded={false}
                aria-label="Disabled expander"
                onClick={() => treeContext.handleSelect && treeContext.handleSelect(id)}
              />
            )}
            {thisNode && (
              <div
                style={{ display: "inline-block" }}
                onContextMenuCapture={() =>
                  treeContext.handleSelect && treeContext.handleSelect(id)
                }
                onClickCapture={() => treeContext.handleSelect && treeContext.handleSelect(id)}
                onFocusCapture={() => treeContext.handleSelect && treeContext.handleSelect(id)}
              >
                <WordEntry
                  id={`${treeContext.id}-treenode-entry-${id}`}
                  ref={currentNameRef}
                  value={thisNode.label}
                  editing={renaming}
                  saving={updatingNode}
                  setValue={(ret) => renameNode(ret)}
                  sendEscape={() => setRenaming(false)}
                  style={{
                    border: currentBorder,
                    margin: currentBorder === "" ? "1px" : "",
                    backgroundColor: currentBorder === "" ? "" : treeContext.textHighlight,
                  }}
                  spellCheck={treeContext.spellCheck}
                />
              </div>
            )}
          </div>
        )}
        {childNodes !== undefined && (
          <div className={`ton-collapsible-wrapper ${expanded ? "" : "collapsed"}`}>
            <div className="ton-collapsible">
              {childNodes.map((h) => (
                <span
                  key={h.id}
                  id={`${treeContext.id}-treenode-child-${h.id}`}
                  className="ton-child"
                >
                  <TreeNode
                    id={h.id}
                    canRemove={canRemoveChildren}
                    canRename={canRenameChildren}
                    canAddChildren={canAddChildren}
                    canRemoveChildren={canRemoveChildren}
                    canRenameChildren={canRenameChildren}
                  />
                </span>
              ))}
            </div>
          </div>
        )}
        {showNewNode && (
          <div>
            <WordEntry
              style={{ marginLeft: "14px" }}
              id={`treenode-new-${id}`}
              ref={newNameRef}
              editing={true}
              setValue={(ret) => {
                confirmNewNode(ret);
              }}
              saving={savingNewNode}
              sendEscape={() => {
                setShowNewNode(false);
              }}
              spellCheck={treeContext.spellCheck}
            />
          </div>
        )}
      </div>
    </ContextMenuHandler>
  );
};

TreeNode.displayName = "TreeNode";
