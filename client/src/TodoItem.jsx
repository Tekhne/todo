import Modal from './Modal';
import Notice from './Notice';
import React, { useContext, useState } from 'react';
import { AppContext } from './app-context';
import { TodosContext } from './todos-context';
import { get } from 'lodash';
import { useModal } from './use-modal';

export function TodoItem({ value }) {
  const { serverApi } = useContext(AppContext);
  const { todosDispatch } = useContext(TodosContext);
  const [deleting, setDeleting] = useState(false);
  const [modalState, setModalState] = useModal();

  const handleDelete = async () => {
    setDeleting(true);

    try {
      await serverApi.delete({ route: 'todos', routeData: { id: value.id } });
      todosDispatch({ type: 'todo:delete', id: value.id });
    } catch (error) {
      const modalContent = (
        <Notice dismissable={false} type="alert">
          {get(error, 'data.message')}
        </Notice>
      );

      setDeleting(false);
      setModalState({ ...modalState, modalContent, showModal: true });
    }
  };

  const handleModalDismiss = () =>
    setModalState({ ...modalState, modalContent: null, showModal: false });

  return (
    <>
      <li className="todo-item">
        <span className="description">{value.description}</span>
        <span className="actions" title="Delete Todo">
          {deleting ? (
            <span className="action">
              <span className="action-icon">...</span>
            </span>
          ) : (
            <span className="action action-delete">
              <span className="action-icon" onClick={handleDelete}>
                &times;
              </span>
            </span>
          )}
        </span>
      </li>
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
