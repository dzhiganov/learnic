/* eslint-disable no-debugger */
import React, { useEffect, memo } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import type { RootState } from '~store/rootReducer';
import { LOGIN, SIGNUP, HOME_WORDS, INDEX } from '~router/paths';
import { Statuses } from '~actions/user';

type Props = {
  children: JSX.Element;
};

const CheckAuth = ({ children }: Props): JSX.Element => {
  const { pathname } = useLocation();

  const history = useHistory();
  const userId = useSelector(({ user: { uid } }: RootState) => uid);
  const fetchUserStatus = useSelector(
    ({ user: { status } }: RootState) => status
  );
  const isReady =
    fetchUserStatus === Statuses.Success || fetchUserStatus === Statuses.Failed;

  useEffect(() => {
    if (pathname === SIGNUP && userId) {
      history.push(HOME_WORDS);
      return;
    }

    if (pathname === SIGNUP && !userId) {
      return;
    }

    if (isReady && !userId) {
      history.push(LOGIN);
    } else if (
      isReady &&
      userId &&
      (pathname === INDEX || pathname === LOGIN)
    ) {
      history.push(HOME_WORDS);
    }
  }, [history, userId, fetchUserStatus, isReady, pathname]);

  if (!isReady) {
    return <span>Loading...</span>;
  }

  return children;
};

export default memo(CheckAuth);
