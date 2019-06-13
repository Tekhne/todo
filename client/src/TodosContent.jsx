import Content from './Content';
import NewTodoForm from './NewTodoForm';
import React, { useContext } from 'react';
import TodoItems from './TodoItems';
import Viewport from './Viewport';
import { TodosContext } from './todos-context';

export function TodosContent() {
  const { todosState, todosDispatch } = useContext(TodosContext);

  const handleNewTodoClick = () => todosDispatch({ type: 'newTodoForm:show' });

  return (
    <Viewport>
      <Content className="todos-content">
        <div className="header">
          <span className="title">Todos</span>
          <span className="menu">
            {todosState.showNewTodoForm || (
              <span className="menu-item">
                <span
                  className="menu-icon plus-icon"
                  onClick={handleNewTodoClick}
                  title="New Todo"
                >
                  +
                </span>
              </span>
            )}
          </span>
        </div>

        {todosState.showNewTodoForm && <NewTodoForm />}

        <TodoItems />
      </Content>
    </Viewport>
  );
}

export default TodosContent;
