import { render, screen } from '@testing-library/react';
import { mockNodes } from '../__mocks__/mockNodes';
import { TreeOfNodes } from '../components/TreeOfNodes';
import { getById } from '../../setupTests';
import userEvent from '@testing-library/user-event';
import exp from 'constants';

describe('Tree of node', () => {
  test('Empty render, click expan', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <TreeOfNodes
        id={'node-tree'}
        nodeList={mockNodes}
        roots={[0]}
      />,
    );
    const child = getById(container, 'node-tree-treenode-child-A');
    const expander = getById(container, 'node-tree-treenode-caret-0');
    expect(child?.style.visibility).toEqual('hidden');
    await user.click(expander as HTMLElement);
    expect(child?.style.visibility).toEqual('inherit');
  });
});
