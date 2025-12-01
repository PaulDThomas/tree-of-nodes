import { ContextMenuHandler, IMenuItem } from "@asup/context-menu";
import { Key, ReactNode, useContext, useEffect, useRef, useState } from "react";
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
import { INodeUpdate } from "./interface";

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
}: TreeNodeProps): ReactNode => {
  // Contexts
  const treeContext = useContext(TreeOfNodesContext);

  // Node information
  const thisNode = treeContext?.nodeList.find((n) => n.id === id);
  const childNodes = treeContext?.nodeList.filter((n) => n.parentId === id);
  const descendents = getDescendentIds(id, treeContext?.nodeList ?? []);

  // State
  const [error, setError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const expanded = (treeContext?.expandedNodes.findIndex((e) => e === id) ?? -1) > -1;

  // Ensures that child nodes are drawn before they are expanded
  // const [hasRenderedClosed, setHasRenderedClosed] = useState<boolean>(
  //   childNodes !== undefined && childNodes.length > 0,
  // );
  // useEffect(() => {
  //   if (childNodes && childNodes.length > 0 && !hasRenderedClosed) {
  //     setHasRenderedClosed(true);
  //   }
  // }, [childNodes, hasRenderedClosed]);

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
  const currentBorder: string = treeContext?.selected.includes(id) ? "1px solid black" : "";
  const nodeColour: string | undefined = (() => {
    if (treeContext && treeContext.selected) {
      const anc = getAncestors(treeContext.selected, [], treeContext?.nodeList).map((n) => n.id);
      if ([...anc, treeContext.selected].includes(id)) return treeContext.nodeHighlight;
    }
    return;
  })();

  // New node parameters
  const newNameRef = useRef<HTMLInputElement | null>(null);
  const [showNewNode, setShowNewNode] = useState<boolean>(false);
  const [savingNewNode, setSavingNewNode] = useState<boolean>(false);

  // Rename parameters
  const currentNameRef = useRef<HTMLInputElement | null>(null);
  const [renaming, setRenaming] = useState<boolean>(false);
  const [updatingNode, setUpdatingNode] = useState<boolean>(false);

  // Context functions
  const handleReturn = (ret: INodeUpdate) => {
    if (!ret.success) {
      setError(true);
      setErrorText(ret.ErrorText ?? "An unknown error has occured");
    } else {
      setError(false);
      setErrorText("");
    }
  };

  const confirmNewNode = async (label: string) => {
    setSavingNewNode(true);
    if (treeContext?.onAddChild) {
      handleReturn(await treeContext.onAddChild(id, label));
    }
    setSavingNewNode(false);
    setShowNewNode(false);
  };

  const renameNode = async (newLabel: string) => {
    setRenaming(false);
    if (treeContext?.onRename) {
      setUpdatingNode(true);
      handleReturn(await treeContext.onRename(id, newLabel));
      setUpdatingNode(false);
    }
  };

  const deleteThis = async () => {
    if (treeContext?.onRemove) {
      setUpdatingNode(true);
      handleReturn(await treeContext.onRemove(id));
      setUpdatingNode(false);
    }
  };

  // Context actions
  const addChild = () => {
    setShowNewNode(true);
    treeContext?.handleExpandClick?.(id, true);
  };
  const renameThis = () => {
    setRenaming(true);
    treeContext?.handleSelect?.(id);
  };

  // Context menu
  const menuItems: IMenuItem[] = [];
  if (canAddChildren) {
    menuItems.push({ label: "Add", action: addChild });
  }
  if (canRename) {
    menuItems.push({ label: "Rename", action: renameThis });
  }
  if (canRemove && (childNodes === undefined || childNodes.length === 0)) {
    menuItems.push({ label: "Delete", action: deleteThis });
  }

  useEffect(() => {
    if (showNewNode === true && newNameRef.current) newNameRef.current.focus();
  }, [showNewNode]);

  // Return node
  return !treeContext ? null : (
    <>
      <ContextMenuHandler
        menuItems={menuItems}
        style={{ display: "inline-block", width: "100%" }}
      >
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
                  onClick={() => treeContext.handleSelect?.(descendents)}
                />
              )}
              {childNodes && childNodes.length > 0 ? (
                !expanded ? (
                  <CaretRightFill
                    id={`${treeContext.id}-treenode-caret-${id}`}
                    style={{ width: "16px", height: "16px" }}
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
                    onClick={() => treeContext.handleExpandClick(id)}
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
                  onClick={() => treeContext.handleSelect?.(id)}
                />
              )}
              {thisNode && (
                <div
                  className="ton-label"
                  style={{ width: `calc(100% - ${treeContext.showCheckBox ? "32px" : "16px"})` }}
                  onContextMenuCapture={() => treeContext.handleSelect?.(id)}
                  onClickCapture={() => {
                    if (!treeContext.expandedNodes.includes(id)) treeContext.handleExpandClick(id);
                    treeContext.handleSelect?.(id);
                  }}
                  onFocusCapture={() => treeContext.handleSelect?.(id)}
                >
                  <WordEntry
                    id={`${treeContext.id}-treenode-entry-${id}`}
                    className={currentBorder ? "selected" : ""}
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
        </div>
      </ContextMenuHandler>
      {childNodes && (
        <div
          className={`ton-collapsible-wrapper ${expanded && childNodes.length > 0 ? "" : "collapsed"}`}
        >
          {childNodes.length > 0 && (
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
          )}
        </div>
      )}
      {showNewNode && (
        <WordEntry
          style={{ marginLeft: "14px" }}
          id={`treenode-new-${id}`}
          ref={newNameRef}
          editing={true}
          setValue={(ret) => confirmNewNode(ret)}
          saving={savingNewNode}
          sendEscape={() => setShowNewNode(false)}
          spellCheck={treeContext.spellCheck}
        />
      )}
    </>
  );
};

TreeNode.displayName = "TreeNode";
