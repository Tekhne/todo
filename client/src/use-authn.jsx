import { isLoggedIn } from './utils';
import { useReducer } from 'react';

const authnInitialState = {
  isLoggedIn: isLoggedIn()
};

function authnReducer(state, action) {
  switch (action.type) {
    case 'login':
      return { ...state, isLoggedIn: true };
    case 'logout':
      return { ...state, isLoggedIn: false };
    default:
      throw new Error(`unknown reducer action type: ${action.type}`);
  }
}

export function useAuthn() {
  const [authnState, authnDispatch] = useReducer(
    authnReducer,
    authnInitialState
  );

  return { authnState, authnDispatch };
}
