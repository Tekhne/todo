import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { TodosContext } from './todos-context';
import { useTodos } from './use-todos';

const propTypes = {
  props: PropTypes.object
};

const defaultProps = {
  props: {}
};

export function TodosProvider(props) {
  const todos = useTodos();
  const value = useMemo(() => todos, [todos]);
  return <TodosContext.Provider value={value} {...props} />;
}

TodosProvider.propTypes = propTypes;
TodosProvider.defaultProps = defaultProps;

export default TodosProvider;
