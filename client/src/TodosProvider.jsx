import React, { useMemo } from 'react';
import { TodosContext } from './todos-context';
import { useTodos } from './use-todos';

export function TodosProvider(props) {
  const todos = useTodos();
  const value = useMemo(() => todos, [todos]);
  return <TodosContext.Provider value={value} {...props} />;
}

export default TodosProvider;
