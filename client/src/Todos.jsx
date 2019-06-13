import Helmet from 'react-helmet';
import React from 'react';
import TodosContent from './TodosContent';
import TodosProvider from './TodosProvider';
import { buildTitle } from './utils';

export function Todos() {
  return (
    <>
      <Helmet>
        <title>{buildTitle('Todos')}</title>
      </Helmet>
      <TodosProvider>
        <TodosContent />
      </TodosProvider>
    </>
  );
}

export default Todos;
