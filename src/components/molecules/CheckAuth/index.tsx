import React, { useEffect, memo, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { HOME_WORDS, INDEX } from '~router/paths';
import { Statuses } from '~actions/user';
import useSelector from '~hooks/useSelector';

type Props = {
  children: JSX.Element;
};

const CheckAuth: React.FC<Props> = ({ children }: Props) => {
  const { pathname } = useLocation();
  const history = useHistory();
  const uid = useSelector<string>('user.uid');
  const userStatus = useSelector<Statuses>('user.status');

  const isReady = useMemo(
    () => [Statuses.Success, Statuses.Failed].includes(userStatus),
    [userStatus]
  );

  useEffect(() => {
    if (pathname === INDEX && !uid) {
      return;
    }

    if (isReady && !uid) {
      history.push(INDEX);
    } else if (isReady && uid && pathname === INDEX) {
      history.push(HOME_WORDS);
    }
  }, [history, uid, isReady, pathname]);

  if (!isReady) {
    return (
      <Backdrop open>
        <CircularProgress disableShrink />
      </Backdrop>
    );
  }

  return children;
};

export default memo(CheckAuth);
