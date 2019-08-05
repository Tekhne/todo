import Modal from './Modal';
import Notice from './Notice';
import React, { useContext, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TodosContext } from './todos-context';
import {
  faEllipsisH,
  faPlus,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { get } from 'lodash';
import { isEmpty } from 'lodash';
import { useAppContext } from './use-app-context';
import { useForm } from './use-form';
import { useModal } from './use-modal';

function buildSubmitCallback({
  modalState,
  serverApi,
  setModalState,
  todosDispatch
}) {
  return async function({ formDispatch, formState }) {
    formDispatch({ type: 'submit:start' });

    if (isEmpty(formState.values.todo)) {
      formDispatch({ type: 'submit:end' });
      todosDispatch({ type: 'newTodoForm:hide' });
      return;
    }

    try {
      const result = await serverApi.post({
        data: formState.values,
        route: 'todos'
      });

      formDispatch({ type: 'submit:end' });
      todosDispatch({ type: 'newTodoForm:hide' });
      todosDispatch({ type: 'todo:add', todo: result.data.todo });
    } catch (error) {
      const modalContent = (
        <Notice dismissable={false} type="alert">
          {get(error, 'data.message')}
        </Notice>
      );

      formDispatch({ type: 'submit:end' });
      formDispatch({ type: 'submit:error', error });
      setModalState({ ...modalState, modalContent, showModal: true });
    }
  };
}

export function NewTodoForm() {
  const [modalState, setModalState] = useModal();
  const todoInputRef = useRef(null);
  const { serverApi } = useAppContext();
  const { todosDispatch } = useContext(TodosContext);

  useEffect(() => {
    if (!todoInputRef.current) return;
    todoInputRef.current.focus();
  });

  const { formState, handleChange, handleSubmit } = useForm({
    fieldNames: ['todo'],
    submitCallback: buildSubmitCallback({
      modalState,
      serverApi,
      setModalState,
      todosDispatch
    })
  });

  const handleBlur = event => {
    if (isEmpty(event.target.value)) {
      return todosDispatch({ type: 'newTodoForm:hide' });
    }
  };

  const handleModalDismiss = () =>
    setModalState({ ...modalState, modalContent: null, showModal: false });

  const handleDelete = () => todosDispatch({ type: 'newTodoForm:hide' });

  return (
    <>
      <div className="new-todo-form">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="todo">New todo</label>
          </div>
          <div className="form-field">
            <span>
              <input
                className={formState.fieldErrors.todo && 'field-has-error'}
                id="todo"
                name="todo"
                onBlur={handleBlur}
                onChange={handleChange}
                ref={todoInputRef}
                type="text"
                value={formState.values.todo}
              />
            </span>
            <span className="icons">
              {formState.submitting ? (
                <span className="icon">
                  <FontAwesomeIcon icon={faEllipsisH} />
                </span>
              ) : (
                <span
                  className="icon icon-add"
                  onClick={handleSubmit}
                  title="Add Todo"
                >
                  <FontAwesomeIcon icon={faPlus} />
                </span>
              )}
              <span
                className="icon icon-delete"
                onClick={handleDelete}
                title="Delete Todo"
              >
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </span>
          </div>
          {formState.fieldErrors.todo && (
            <div className="form-field-error">
              Todo {formState.fieldErrors.todo}.
            </div>
          )}
        </form>
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

export default NewTodoForm;
