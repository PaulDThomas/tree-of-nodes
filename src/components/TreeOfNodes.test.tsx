import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockNodes } from '../__mocks__/mockNodes';
import { TreeOfNodes } from './TreeOfNodes';

describe('Tree of node', () => {
  test('Empty render, click expand', async () => {
    const user = userEvent.setup();
    await act(async () => {
      render(
        <div data-testid='container'>
          <TreeOfNodes
            id={'node-tree'}
            selected={['Z']}
            nodeList={mockNodes}
            roots={[0]}
          />
        </div>,
      );
    });
    const container = screen.queryByTestId('container') as HTMLDivElement;
    const child = container.querySelector('#node-tree-treenode-child-A') as HTMLSpanElement;
    expect(child).toBeInTheDocument();
    expect(child.style.visibility).toEqual('hidden');

    const expander = container.querySelector('#node-tree-treenode-caret-0') as HTMLDivElement;
    expect(expander).toBeInTheDocument();
    await user.click(expander as HTMLElement);
    expect(child.style.visibility).toEqual('inherit');

    const closer = container.querySelector('#node-tree-treenode-caret-0') as HTMLDivElement;
    await user.click(closer);
    expect(child?.style.visibility).toEqual('hidden');

    const item = container.querySelector('#node-tree-treenode-entry-0');
    expect(item).toBeInTheDocument();
    await user.click(item as HTMLElement);
  });
});
