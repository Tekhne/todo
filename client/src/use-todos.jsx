import { cloneDeep, uniqBy } from 'lodash';
import { useReducer } from 'react';

const initialTodosState = {
  backup: null,
  reorderable: true,
  showNewTodoForm: false,
  todos: []
};

function isDraggingDown({ drag, hover }) {
  return drag.manual_priority < hover.manual_priority;
}

function isMouseInBoundingRect(action) {
  return (
    action.dragMouseCoordinates.X <= action.hoverBoundingRect.right &&
    action.dragMouseCoordinates.X >= action.hoverBoundingRect.left &&
    action.dragMouseCoordinates.Y <= action.hoverBoundingRect.bottom &&
    action.dragMouseCoordinates.Y >= action.hoverBoundingRect.top
  );
}

function shouldMoveTodoUp({ drag, hover, todo }) {
  return (
    todo.manual_priority <= hover.manual_priority &&
    todo.manual_priority > drag.manual_priority
  );
}

function shouldMoveTodoDown({ drag, hover, todo }) {
  return (
    todo.manual_priority >= hover.manual_priority &&
    todo.manual_priority < drag.manual_priority
  );
}

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
    case 'todo:backup':
      return state.backup
        ? state
        : { ...state, backup: cloneDeep(state.todos) };
    case 'todo:delete':
      return { ...state, todos: state.todos.filter(t => t.id !== action.id) };
    case 'todo:dragEnd':
      return { ...state, reorderable: true };
    case 'todo:dragLeave':
      return { ...state, reorderable: true };
    case 'todo:dragOver':
      if (action.dragId === action.hoverId) return state;

      if (!state.reorderable) {
        if (isMouseInBoundingRect(action)) {
          return state;
        } else {
          return { ...state, reorderable: true };
        }
      }

      const drag = state.todos.find(t => t.id === action.dragId);
      const hover = state.todos.find(t => t.id === action.hoverId);

      const todos = state.todos.map(todo => {
        if (todo.id === drag.id) {
          return { ...todo, manual_priority: hover.manual_priority };
        }

        if (isDraggingDown({ drag, hover })) {
          if (shouldMoveTodoUp({ drag, hover, todo })) {
            return { ...todo, manual_priority: todo.manual_priority - 1 };
          }
        } else {
          if (shouldMoveTodoDown({ drag, hover, todo })) {
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
