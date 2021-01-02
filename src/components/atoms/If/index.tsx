import React from 'react';

type Props = {
  condition: boolean;
  children: JSX.Element;
};

const If = ({ condition, children }: Props): JSX.Element => {
  return <>{condition ? children : null}</>;
};

export default If;
