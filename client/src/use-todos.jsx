import { uniqBy } from 'lodash';
import { useReducer } from 'react';

const initialTodosState = {
  reorderable: true,
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
    case 'todo:dragEnd':
      return { ...state, reorderable: true };
    case 'todo:dragLeave':
      return { ...state, reorderable: true };
    case 'todo:dragOver':
      if (action.dragId === action.hoverId) return state;

      if (!state.reorderable) {
        if (
          action.dragMouseCoordinates.X <= action.hoverBoundingRect.right &&
          action.dragMouseCoordinates.X >= action.hoverBoundingRect.left &&
          action.dragMouseCoordinates.Y <= action.hoverBoundingRect.bottom &&
          action.dragMouseCoordinates.Y >= action.hoverBoundingRect.top
        ) {
          return state;
        } else {
          return { ...state, reorderable: true };
        }
      }

      const drag = state.todos.find(t => t.id === action.dragId);
      const hover = state.todos.find(t => t.id === action.hoverId);

      let dragDirection =
        drag.manual_priority < hover.manual_priority ? 'down' : 'up';

      const todos = state.todos.map(todo => {
        if (todo.id === drag.id) {
          return { ...todo, manual_priority: hover.manual_priority };
        }

        if (dragDirection === 'down') {
          if (
            todo.manual_priority <= hover.manual_priority &&
            todo.manual_priority > drag.manual_priority
          ) {
            return { ...todo, manual_priority: todo.manual_priority - 1 };
          }
        } else {
          if (
            todo.manual_priority >= hover.manual_priority &&
            todo.manual_priority < drag.manual_priority
          ) {
            return { ...todo, manual_priority: todo.manual_priority + 1 };
          }
        }

        return todo;
      });

      return { ...state, reorderable: false, todos };
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
