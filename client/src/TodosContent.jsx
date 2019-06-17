import Content from './Content';
import NewTodoForm from './NewTodoForm';
import React, { useContext } from 'react';
import TodoItems from './TodoItems';
import Viewport from './Viewport';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TodosContext } from './todos-context';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

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
                  <FontAwesomeIcon icon={faPlus} />
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
