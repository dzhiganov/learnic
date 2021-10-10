import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Tag, { Status } from './Tag';

const mockedOnClick = jest.fn();

const renderNewTag = (status: Status) => {
  const utils = render(
    <Tag name="FAKE_TAG_NAME" onClick={mockedOnClick} status={status} />
  );

  return {
    ...utils,
  };
};

describe('test Tag', () => {
  test('should has active-class if status is Active', () => {
    const { queryByTestId } = renderNewTag(Status.Active);

    expect(queryByTestId('tagLabel')?.classList.toString()).toMatch(/active/);
  });

  test('should has suggested-class if status is Suggested', () => {
    const { queryByTestId } = renderNewTag(Status.Suggested);

    expect(queryByTestId('tagLabel')?.classList.toString()).toMatch(
      /suggested/
    );
  });

  test('should has new-class if status is new', () => {
    const { queryByTestId } = renderNewTag(Status.New);

    expect(queryByTestId('tagLabel')?.classList.toString()).toMatch(/new/);
  });

  test('onClick should have been called after Enter clicked', () => {
    const { queryByTestId } = renderNewTag(Status.New);

    userEvent.type(queryByTestId('tagLabel') as HTMLElement, '{enter}');

    expect(mockedOnClick).toHaveBeenCalled();
  });
});
