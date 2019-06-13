import Notice from './Notice';
import React, { useContext, useEffect, useState } from 'react';
import TodoItem from './TodoItem';
import { AppContext } from './app-context';
import { TodosContext } from './todos-context';
import { get, isEmpty } from 'lodash';

export function TodoItems() {
  const { serverApi } = useContext(AppContext);
  const { todosState, todosDispatch } = useContext(TodosContext);
  const [loadingError, setLoadingError] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const todoItems = todosState.todos.map(todo => (
    <TodoItem key={todo.id} value={todo} />
  ));

  if (isEmpty(todoItems)) {
    return (
      <div className="todo-items">
        <p className="add-hint">Add a todo item.</p>
      </div>
    );
  }

  return (
    <div className="todo-items">
      <ul className="todo-items-list">{todoItems}</ul>
    </div>
  );
}

export default TodoItems;
