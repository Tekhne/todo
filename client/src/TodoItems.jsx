import Notice from './Notice';
import React, { useContext, useEffect, useState } from 'react';
import TodoItem from './TodoItem';
import { AppContext } from './app-context';
import { TodosContext } from './todos-context';
import { get, isEmpty, sortBy } from 'lodash';

const initialDragState = {
  todo: null
};

export function TodoItems() {
  const [dragState, setDragState] = useState(initialDragState);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(null);
  const { serverApi } = useContext(AppContext);
  const { todosState, todosDispatch } = useContext(TodosContext);

  useEffect(() => {
    async function getTodos() {
      try {
        const result = await serverApi.get({ route: 'todos' });

        if (!isEmpty(get(result, 'data.todos'))) {
          todosDispatch({ type: 'todo:addMany', todos: result.data.todos });
        }
      } catch (error) {
        setLoadingError(get(error, 'data.message'));
      }

      setLoading(false);
    }

    if (loading) getTodos();
  }, [loading, serverApi, todosDispatch]);

  if (loading) {
    return (
      <div className="todo-items">
        <p className="loading-hint">Loading todo items ...</p>
      </div>
    );
  }

  if (loadingError) {
    return (
      <div className="todo-items">
        <Notice type="alert">{loadingError}</Notice>
      </div>
    );
  }

  const todoItems = sortBy(todosState.todos, 'manual_priority').map(todo => (
    <TodoItem
      dragState={dragState}
      key={todo.id}
      setDragState={setDragState}
      todo={todo}
    />
  ));

  if (isEmpty(todoItems)) {
    return (
      <div className="todo-items">
        <p className="add-hint">Add a todo item.</p>
      </div>
    );
  }

  return <div className="todo-items">{todoItems}</div>;
}

export default TodoItems;
