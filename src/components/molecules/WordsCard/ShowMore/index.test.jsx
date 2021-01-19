import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ShowMore from '.';

describe('ShowMore', () => {
  test('Correct textContent', () => {
    const { container } = render(<ShowMore />);

    const button = container.querySelector('button');

    expect(button).toHaveTextContent(/Show More/i);
  });

  test('Correct type', () => {
    const { container } = render(<ShowMore />);

    const button = container.querySelector('button');

    expect(button).toHaveAttribute('type', 'button');
  });

  test('click on button', () => {
    const onShowMore = jest.fn();
    const { container } = render(<ShowMore onShowMore={onShowMore} />);

    const button = container.querySelector('button');

    fireEvent.click(button);

    expect(onShowMore).toHaveBeenCalled();
  });
});
