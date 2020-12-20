import React, { useEffect, memo } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import type { RootState } from '../../../core/store/rootReducer';
import { LOGIN, HOME } from '../../../core/router/paths';
import { Statuses } from '../../../core/store/models/user';

type Props = {
  children: JSX.Element;
};

const CheckAuth = ({ children }: Props): JSX.Element => {
  const history = useHistory();
  const userId = useSelector(({ user: { uid } }: RootState) => uid);
  const fetchUserStatus = useSelector(
    ({ user: { status } }: RootState) => status
  );
  const isReady =
    fetchUserStatus === Statuses.Success || fetchUserStatus === Statuses.Failed;

  useEffect(() => {
    if (isReady) {
      history.push(userId ? HOME : LOGIN);
    }
  }, [history, userId, fetchUserStatus, isReady]);

  if (!isReady) {
    return <span>Loading...</span>;
  }

  return children;
};

export default memo(CheckAuth);
