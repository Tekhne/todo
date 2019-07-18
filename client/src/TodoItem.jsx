import Modal from './Modal';
import Notice from './Notice';
import React, { useCallback, useContext, useRef, useState } from 'react';
import { AppContext } from './app-context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TodosContext } from './todos-context';
import { faEllipsisH, faTimes } from '@fortawesome/free-solid-svg-icons';
import { get, isNil } from 'lodash';
import { useModal } from './use-modal';

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

  /*
   * FIXME
   * // A dragged item (element or text selection) is dragged.
   * const handleDrag = useCallback(event => {
   * }, []);
   */

  // A drag operation ends (such as releasing a mouse button or hitting the Esc
  // key; see Finishing a Drag.)
  const handleDragEnd = useCallback(
    event => {
      setDragState({ ...dragState, todo: null });
      todosDispatch({ type: 'todo:dragEnd' });
    },
    [dragState, setDragState, todosDispatch]
  );

  /*
   * FIXME
   * // A dragged item enters a valid drop target. (See Specifying Drop Targets.)
   * const handleDragEnter = useCallback(
   *   event => {
   *     setDragState({ ...dragState, isHovering: true });
   *   },
   *   [dragState, setDragState]
   * );
   */

  /*
   * FIXME
   * // An element is no longer the drag operation's immediate selection target.
   * const handleDragExit = useCallback(event => {
   * }, []);
   */

  // A dragged item leaves a valid drop target.
  const handleDragLeave = useCallback(
    event => {
      todosDispatch({ type: 'todo:dragLeave' });
    },
    [todosDispatch]
  );

  // A dragged item is being dragged over a valid drop target, every few hundred milliseconds.
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

  // The user starts dragging an item. (See Starting a Drag Operation.)
  const handleDragStart = useCallback(
    event => {
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.setData('text/plain', todo.id);
      setDragState({ ...dragState, todo });
    },
    [dragState, setDragState, todo]
  );

  // An item is dropped on a valid drop target. (See Performing a Drop.)
  const handleDrop = useCallback(event => {
    event.preventDefault();
  }, []);

  let dragProps;

  /*
   * drop zone receives these events:
   *   handleDragEnter
   *   handleDragOver
   *   handleDragExit
   *   handleDragLeave
   *   handleDrop
   */

  // FIXME
  if (isNil(dragState.todo) || todo.id === dragState.todo.id) {
    dragProps = {
      draggable: true,
      // onDrag: handleDrag,
      onDragEnd: handleDragEnd,
      // onDragEnter: handleDragEnter,
      // onDragExit: handleDragExit,
      onDragLeave: handleDragLeave,
      // onDragOver: handleDragOver,
      onDragStart: handleDragStart
      // onDrop: handleDrop
    };
  } else {
    dragProps = {
      // draggable: true,
      // onDrag: handleDrag,
      // onDragEnd: handleDragEnd,
      // onDragEnter: handleDragEnter,
      // onDragExit: handleDragExit,
      // onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      // onDragStart: handleDragStart,
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

export default TodoItem;
