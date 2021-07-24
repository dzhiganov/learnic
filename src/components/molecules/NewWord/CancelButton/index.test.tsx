import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CancelButton from '.';

describe('Cancel button', () => {
  test('should has correct type', () => {
    const onCancel = jest.fn();
    const { container } = render(<CancelButton onCancel={onCancel} />);

    const button = container.querySelector('button');

    expect(button).toHaveAttribute('type', 'button');
  });

  test('has been clicked', () => {
    const onCancel = jest.fn();
    const { container } = render(<CancelButton onCancel={onCancel} />);

    const button = container.querySelector('button') as HTMLButtonElement;

    fireEvent.click(button);

    expect(onCancel).toHaveBeenCalled();
  });
});
