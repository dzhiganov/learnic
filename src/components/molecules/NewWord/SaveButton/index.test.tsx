import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SaveButton from '.';

const noop = () => {};

describe('Save button', () => {
  test('should has correct type', () => {
    const onSave = jest.fn();
    const { container } = render(<SaveButton onSave={onSave} />);

    const button = container.querySelector('button');

    expect(button).toHaveAttribute('type', 'button');
  });

  test('to has been clicked', () => {
    const onSave = jest.fn();
    const { container } = render(<SaveButton onSave={onSave} />);

    const button = container.querySelector('button') as HTMLButtonElement;

    fireEvent.click(button);

    expect(onSave).toHaveBeenCalled();
  });

  test('should be disabled', () => {
    const { container } = render(<SaveButton onSave={noop} disabled />);

    const button = container.querySelector('button') as HTMLButtonElement;

    expect(button).toBeDisabled();
  });

  test('should not be disabled if disabled props did not provide', () => {
    const { container } = render(<SaveButton onSave={noop} />);

    const button = container.querySelector('button') as HTMLButtonElement;

    expect(button).not.toBeDisabled();
  });
});
