import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SaveButton from '.';

describe('ShowMore', () => {
  test('Correct textContent', () => {
    const onSave = jest.fn();
    const { container } = render(<SaveButton onSave={onSave} />);

    const button = container.querySelector('button');

    expect(button).toHaveTextContent(/Save/i);
  });

  test('Correct type', () => {
    const onSave = jest.fn();
    const { container } = render(<SaveButton onSave={onSave} />);

    const button = container.querySelector('button');

    expect(button).toHaveAttribute('type', 'button');
  });

  test('click on button', () => {
    const onSave = jest.fn();
    const { container } = render(<SaveButton onSave={onSave} />);

    const button = container.querySelector('button') as HTMLButtonElement;

    fireEvent.click(button);

    expect(onSave).toHaveBeenCalled();
  });
});
