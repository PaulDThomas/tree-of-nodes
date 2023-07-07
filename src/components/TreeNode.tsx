import { ContextMenuHandler, iMenuItem } from '@asup/context-menu';
import { Key, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  CaretDownFill,
  CaretRight,
  CaretRightFill,
  ExclamationCircleFill,
} from 'react-bootstrap-icons';
import { getAncestors } from '../functions/getAncestors';
import { iNodeUpdate } from './interface';
import { TreeOfNodesContext } from './TreeOfNodesContext';
import { WordEntry } from './WordEntry';

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

  // State
  const [error, setError] = useState<boolean>(false);
  const [errorText, setErrotText] = useState<string | null>(null);
  const expanded = useMemo(() => {
    return (treeContext?.expandedNodes.findIndex((e) => e === id) ?? -1) > -1;
  }, [id, treeContext?.expandedNodes]);

  // Apply selected border
  const currentBorder = useMemo<string>(() => {
    return treeContext?.selected.includes(id) ? '1px solid black' : '';
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
      setErrotText(ret.ErrorText ?? 'An unknown error has occured');
    } else {
      setError(false);
      setErrotText(null);
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
    treeContext?.handleSelect(id);
  }, [id, treeContext]);

  // Context menu
  const menuItems = useMemo(() => {
    const menuItems: iMenuItem[] = [];
    if (canAddChildren) {
      menuItems.push({ label: 'Add', action: addChild });
    }
    if (canRename) {
      menuItems.push({ label: 'Rename', action: renameThis });
    }
    if (canRemove && (childNodes === undefined || childNodes.length === 0)) {
      menuItems.push({ label: 'Delete', action: deleteThis });
    }
    return menuItems;
  }, [addChild, canAddChildren, canRemove, canRename, childNodes, deleteThis, renameThis]);

  // Return node
  if (!treeContext) return <></>;
  return (
    <ContextMenuHandler menuItems={menuItems}>
      <div
        id={`${treeContext.id}-treenode-${id}`}
        className='treenode'
      >
        {error ? (
          <>
            <ExclamationCircleFill color='var(--bs-danger)' />{' '}
            {errorText && errorText !== '' ? errorText : 'An unknown error has occured'}
          </>
        ) : (
          <span>
            {childNodes !== undefined && childNodes.length > 0 ? (
              !expanded ? (
                <CaretRightFill
                  id={`${treeContext.id}-treenode-caret-${id}`}
                  role='button'
                  color={nodeColour}
                  aria-expanded={false}
                  onClick={() => treeContext.handleExpandClick(id)}
                />
              ) : (
                <CaretDownFill
                  id={`${treeContext.id}-treenode-caret-${id}`}
                  role='button'
                  aria-expanded={true}
                  color={nodeColour}
                  onClick={() => {
                    treeContext.handleExpandClick(id);
                  }}
                />
              )
            ) : (
              <CaretRight
                id={`${treeContext.id}-treenode-caret-${id}`}
                role='button'
                color={nodeColour}
                aria-expanded={false}
                aria-disabled={true}
              />
            )}
            {thisNode && (
              <div
                style={{ display: 'inline-block' }}
                onContextMenuCapture={() => treeContext.handleSelect(id)}
                onClickCapture={() => treeContext.handleSelect(id)}
                onFocusCapture={() => treeContext.handleSelect(id)}
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
                    margin: currentBorder === '' ? '1px' : '',
                    backgroundColor: currentBorder === '' ? '' : treeContext.textHighlight,
                  }}
                />
              </div>
            )}
          </span>
        )}
        {childNodes !== undefined &&
          childNodes.map((h) => (
            <span
              key={h.id}
              id={`${treeContext.id}-treenode-child-${h.id}`}
              style={{
                marginLeft: '16px',
                display: 'block',
                maxHeight: expanded ? '99999px' : '0px',
                height: expanded ? 'auto' : '0px',
                overflowY: 'hidden',
                visibility: expanded ? 'inherit' : 'hidden',
                opacity: expanded ? 1 : 0,
                transition: 'visibility .3s, opacity .3s ease-in-out, max-height 0.3s ease-in-out',
              }}
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
        {showNewNode && (
          <div>
            <WordEntry
              style={{ marginLeft: '14px' }}
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
            />
          </div>
        )}
      </div>
    </ContextMenuHandler>
  );
};

TreeNode.displayName = 'TreeNode';
