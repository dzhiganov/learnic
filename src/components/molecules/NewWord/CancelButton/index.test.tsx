import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CancelButton from '.';

describe('ShowMore', () => {
  test('Correct textContent', () => {
    const onCancel = jest.fn();
    const { container } = render(<CancelButton onCancel={onCancel} />);

    const button = container.querySelector('button');

    expect(button).toHaveTextContent(/Cancel/i);
  });

  test('Correct type', () => {
    const onCancel = jest.fn();
    const { container } = render(<CancelButton onCancel={onCancel} />);

    const button = container.querySelector('button');

    expect(button).toHaveAttribute('type', 'button');
  });

  test('click on button', () => {
    const onCancel = jest.fn();
    const { container } = render(<CancelButton onCancel={onCancel} />);

    const button = container.querySelector('button') as HTMLButtonElement;

    fireEvent.click(button);

    expect(onCancel).toHaveBeenCalled();
  });
});
