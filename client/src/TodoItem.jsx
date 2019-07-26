import Modal from './Modal';
import Notice from './Notice';
import PropTypes from 'prop-types';
import React, { useCallback, useContext, useRef, useState } from 'react';
import { AppContext } from './app-context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TodosContext } from './todos-context';
import { faEllipsisH, faTimes } from '@fortawesome/free-solid-svg-icons';
import { get, isNil } from 'lodash';
import { useModal } from './use-modal';

const propTypes = {
  dragState: PropTypes.object.isRequired,
  setDragState: PropTypes.func.isRequired,
  todo: PropTypes.object.isRequired
};

function isDraggable(dragState, todo) {
  return isNil(dragState.todo) || todo.id === dragState.todo.id;
}

export function TodoItem({ dragState, setDragState, todo }) {
  const [deleting, setDeleting] = useState(false);
  const [modalState, setModalState] = useModal();
  const ref = useRef(null);
  const { serverApi } = useContext(AppContext);
  const { todosDispatch } = useContext(TodosContext);

  const handleDelete = useCallback(async () => {
    setDeleting(true);

    try {
      await serverApi.delete({ route: 'todos', routeData: { id: todo.id } });
      todosDispatch({ type: 'todo:delete', id: todo.id });
    } catch (error) {
      const modalContent = (
        <Notice dismissable={false} type="alert">
          {get(error, 'data.message')}
        </Notice>
      );

      setDeleting(false);
      setModalState({ ...modalState, modalContent, showModal: true });
    }
  }, [modalState, serverApi, setDeleting, setModalState, todosDispatch, todo]);

  const handleModalDismiss = useCallback(() => {
    setModalState({ ...modalState, modalContent: null, showModal: false });
  }, [modalState, setModalState]);

  const handleDragEnd = useCallback(
    event => {
      event.currentTarget.classList.remove('dragging');
      setDragState({ ...dragState, todo: null });
      todosDispatch({ type: 'todo:dragEnd' });
    },
    [dragState, setDragState, todosDispatch]
  );

  const handleDragLeave = useCallback(
    event => {
      todosDispatch({ type: 'todo:dragLeave' });
    },
    [todosDispatch]
  );

  const handleDragOver = useCallback(
    event => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';

      todosDispatch({
        type: 'todo:dragOver',
        dragId: dragState.todo.id,
        dragMouseCoordinates: { X: event.clientX, Y: event.clientY },
        hoverBoundingRect: ref.current.getBoundingClientRect(),
        hoverId: todo.id
      });
    },
    [dragState, todo, todosDispatch]
  );

  const handleDragStart = useCallback(
    event => {
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.setData('text/plain', todo.id);
      event.currentTarget.classList.add('dragging');
      setDragState({ ...dragState, todo });
      todosDispatch({ type: 'todo:backup' });
    },
    [dragState, setDragState, todo, todosDispatch]
  );

  const handleDrop = useCallback(event => {
    event.preventDefault();
  }, []);

  let dragProps;

  if (isDraggable(dragState, todo)) {
    dragProps = {
      draggable: true,
      onDragEnd: handleDragEnd,
      onDragLeave: handleDragLeave,
      onDragStart: handleDragStart
    };
  } else {
    dragProps = {
      onDragOver: handleDragOver,
      onDrop: handleDrop
    };
  }

  return (
    <>
      <div className="todo-item" ref={ref} {...dragProps}>
        <span className="description">{todo.description}</span>
        <span className="actions" title="Delete Todo">
          {deleting ? (
            <span className="action-icon">
              <FontAwesomeIcon icon={faEllipsisH} />
            </span>
          ) : (
            <span className="action-delete action-icon" onClick={handleDelete}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
          )}
        </span>
      </div>
      <Modal
        handleDismiss={handleModalDismiss}
        isOpen={modalState.showModal}
        onRequestClose={handleModalDismiss}
      >
        {modalState.modalContent}
      </Modal>
    </>
  );
}

TodoItem.propTypes = propTypes;

export default TodoItem;
