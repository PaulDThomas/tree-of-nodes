[npm]: https://img.shields.io/npm/v/@asup/tree-of-nodes
[npm-url]: https://www.npmjs.com/package/@asup/tree-of-nodes
[size]: https://packagephobia.now.sh/badge?p=@asup/tree-of-nodes
[size-url]: https://packagephobia.now.sh/result?p=@asup/tree-of-nodes

[![npm][npm]][npm-url]
[![size][size]][size-url]
![npm bundle size](https://img.shields.io/bundlephobia/min/@asup/tree-of-nodes)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://raw.githubusercontent.com/PaulDThomas/tree-of-nodes/master/LICENCE)

# @asup/tree-of-notes

REACT treeview, because I couldn't quite find what I wanted.

Works with/needs bootstrap, react-bootstrap, react-bootstrap-icons.
Uses a context menu to facilitate Add/Rename/Remove actions.

## Installation

```
# with npm
npm install @asup/tree-of-nodes
```

## Tree-of-nodes Usage

```
import { iNodeUpdate, TreeNodeData, TreeOfNodes } from '@asup/tree-of-nodes';
import '@asup/tree-of-nodes/dist/style.css';

... inside REACT component

<TreeOfNodes<T>
  id: string;
  nodeList: TreeNodeData<T>[];
  roots: Key[];
  multiSelect?: boolean;
  selectedIds?: Key[];
  handleSelect?: (ret: Key) => void;
  onAdd?: (parentId: Key, newName: string) => Promise<iNodeUpdate>;
  onRemove?: (childId: Key) => Promise<iNodeUpdate>;
  onRename?: (childId: Key, newName: string) => Promise<iNodeUpdate>;
  canRemoveRoot?: boolean;
  canRenameRoot?: boolean;
  canAddChildren?: boolean;
  canRemoveChildren?: boolean;
  canRenameChildren?: boolean;
  nodeHighlight?: string;
  textHighlight?: string;
  />
```

The component expects a list of nodes of type `TreeNodeData<T>` with unique `Key`s.

## Properties

| Prop              | Description                                                                                     |      Default       |
| :---------------- | :---------------------------------------------------------------------------------------------- | :----------------: |
| id                | HTML id attribute                                                                               |                    |
| nodeList          | Array of node data                                                                              |                    |
| roots             | One or more node Keys to use as the root of the tree                                            |                    |
| multiSelect       | Allow selection of more than 1 id                                                               |      `false`       |
| selectedIds       | Currently selected list                                                                         |                    |
| handleSelect      | Function called when a node is clicked (selected), this should be used to update the selectedId | `() => {return;}`  |
| onAdd             | Function called when a new node is added, this should be used to update the nodeList            |                    |
| onRemove          | Function called when a node is removed, this should be used to update the nodeList              |                    |
| onRename          | Function called when a node is renamed, this should be used to update the nodeList              |                    |
| canRemoveRoot     | Allows removal of a root node in combination with specification of onRemove function            |      `false`       |
| canRenameRoot     | Allows renaming of a root node in combination with specification of onRename function           |      `false`       |
| canAddChildren    | Allows addition of children in combination with specification of onAdd function                 |      `false`       |
| canRemoveChildren | Allows renaming of non-root nodes in combination with specification of onRemove function        |      `false`       |
| canRenameChildren | Allows renaming of non-root nodes in combination with specification of onRename function        |      `false`       |
| nodeHighlight     | Selected node highlight colour                                                                  |       `red`        |
| textHighlight     | Selected text highlight colour                                                                  | `rgba(255,0,0,0.2` |

### TreeNodeData

Required format for list of nodes, includes a holder for any type of data, which is there specified in the `TreeOfNodes` specification.

```
export type TreeNodeData<T> = {
  id: Key;
  label: string;
  parentId?: Key;
  data: T;
};
```

### iNodeUpdate

Use this format to return from update functions.

```
export interface iNodeUpdate {
  success: boolean;
  ErrorText?: string;
}
```
