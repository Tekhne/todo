import Helmet from 'react-helmet';
import React from 'react';
import { buildTitle } from './utils';

export function Todos() {
  return (
    <>
      <Helmet>
        <title>{buildTitle('Todos')}</title>
      </Helmet>
      <span>Todos</span>
    </>
  );
}

export default Todos;
