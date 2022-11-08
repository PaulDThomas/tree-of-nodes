import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WordEntry } from '../components/WordEntry';

describe('Word entry', () => {
  test('Empty render', async () => {
    const { container } = render(<WordEntry id='testControl' />);
    const we = container.querySelector('#testControl') as HTMLElement;
    expect(we).toBeInTheDocument();
    expect(we.nodeName).toEqual('SPAN');
    expect(we.textContent).toEqual('');
  });

  test('Read only render', async () => {
    render(<WordEntry value='Check' />);
    const we = screen.queryByText('Check') as HTMLElement;
    expect(we).toBeInTheDocument();
    expect(we.nodeName).toEqual('SPAN');
  });

  it('Editable render and blur', async () => {
    const mockSet = jest.fn();
    const user = userEvent.setup();
    render(
      <WordEntry
        id='testControl'
        value='Check'
        editing={true}
        setValue={mockSet}
      />,
    );
    const we = screen.getByDisplayValue('Check') as HTMLElement;
    expect(we).toBeInTheDocument();
    expect(we.nodeName).toEqual('INPUT');
    await act(async () => {
      await user.clear(we);
      await user.type(we, 'One-Two');
      fireEvent.blur(we);
    });
    expect(mockSet).toHaveBeenCalledTimes(1);
    expect(mockSet).toHaveBeenCalledWith('One-Two');
  });

  it('Editable render and return', async () => {
    const mockSet = jest.fn();
    const user = userEvent.setup();
    render(
      <WordEntry
        id='testControl'
        value='Check'
        editing={true}
        setValue={mockSet}
      />,
    );
    const we = screen.getByDisplayValue('Check') as HTMLElement;
    expect(we).toBeInTheDocument();
    expect(we.nodeName).toEqual('INPUT');
    await user.type(we, ' one{Enter}');
    expect(we).toHaveValue('Check one');
    expect(mockSet).toHaveBeenCalledTimes(1);
    expect(mockSet).toHaveBeenCalledWith('Check one');
  });

  test('Editable render and escape', async () => {
    const mockEscape = jest.fn();
    const mockSet = jest.fn();
    const user = userEvent.setup();
    const { container } = render(
      <WordEntry
        id='testControl'
        editing={true}
        setValue={mockSet}
        sendEscape={mockEscape}
      />,
    );
    const we = container.querySelector('#testControl') as HTMLElement;
    expect(we).toBeInTheDocument();
    expect(we.nodeName).toEqual('INPUT');
    fireEvent.focus(we);
    await user.clear(we);
    await user.type(we, 'One-Two');
    await user.keyboard('{Escape}');
    expect(we).toHaveValue('');
    expect(mockSet).not.toHaveBeenCalled();
    expect(mockEscape).toHaveBeenCalledTimes(1);
  });

  test('Editable render and escape 2', async () => {
    const mockEscape = jest.fn();
    const mockSet = jest.fn();
    const user = userEvent.setup();
    render(
      <WordEntry
        value='Check'
        editing={true}
        setValue={mockSet}
        sendEscape={mockEscape}
      />,
    );
    const we = screen.getByDisplayValue('Check') as HTMLElement;
    expect(we).toBeInTheDocument();
    expect(we.nodeName).toEqual('INPUT');
    fireEvent.focus(we);
    await user.clear(we);
    await user.type(we, 'One-Two');
    await user.keyboard('{Escape}');
    expect(we).toHaveValue('Check');
    expect(mockEscape).toHaveBeenCalledTimes(1);
  });

  test('Saving render', async () => {
    const mockEscape = jest.fn();
    const mockSet = jest.fn();
    const { container } = render(
      <WordEntry
        id='testControl'
        value='Check'
        editing={true}
        setValue={mockSet}
        sendEscape={mockEscape}
        saving
      />,
    );
    const we = screen.getByDisplayValue('Check') as HTMLInputElement;
    const spinner = container.querySelector('#testControl-spinner');
    expect(we).toBeInTheDocument();
    expect(spinner).toBeInTheDocument();
    expect(we.nodeName).toEqual('INPUT');
    expect(we).toHaveValue('Check');
    expect(we.disabled).toEqual(true);
  });

  test('Saving render, no id', async () => {
    const { container } = render(
      <WordEntry
        value='Check'
        saving
        editing
      />,
    );
    screen.debug();
    const we = screen.getByDisplayValue('Check') as HTMLInputElement;
    const spinner = container.querySelector('.spinner-border');
    expect(we).toBeInTheDocument();
    expect(spinner).toBeInTheDocument();
  });
});
