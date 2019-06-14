import { uniqBy } from 'lodash';
import { useReducer } from 'react';

const initialTodosState = {
  showNewTodoForm: false,
  todos: []
};

function uniqTodos(todos) {
  return uniqBy(todos, t => t.id);
}

function todosReducer(state, action) {
  switch (action.type) {
    case 'newTodoForm:hide':
      return { ...state, showNewTodoForm: false };
    case 'newTodoForm:show':
      return { ...state, showNewTodoForm: true };
    case 'todo:add':
      return { ...state, todos: uniqTodos([...state.todos, action.todo]) };
    case 'todo:addMany':
      return { ...state, todos: uniqTodos([...state.todos, ...action.todos]) };
    case 'todo:delete':
      return { ...state, todos: state.todos.filter(t => t.id !== action.id) };
    default:
      throw new Error(`unknown reducer action type: ${action.type}`);
  }
}

export function useTodos() {
  const [todosState, todosDispatch] = useReducer(
    todosReducer,
    initialTodosState
  );

  return { todosState, todosDispatch };
}
