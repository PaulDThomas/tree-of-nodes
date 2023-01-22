import { Key } from 'react';

export interface iNodeUpdate {
  success: boolean;
  ErrorText?: string;
}

export interface TreeNodeBase {
  id: Key;
  label: string;
  parentId?: Key;
}

export interface TreeNodeData<T> extends TreeNodeBase {
  data: T;
}
