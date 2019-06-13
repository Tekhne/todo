import React from 'react';

export function TodoItem({ value }) {
  return (
    <li className="todo-item">
      <span className="description">{value.description}</span>
      <span className="actions" title="Delete Todo">
        <span className="action action-delete">
         <span className="action-icon">
            &times;
          </span>
        </span>
      </span>
    </li>
  );
}

export default TodoItem;
