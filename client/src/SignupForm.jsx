import * as yup from 'yup';
import Modal from './Modal';
import Notice from './Notice';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { useAppContext } from './use-app-context';
import { useForm } from './use-form';
import { useModal } from './use-modal';
import { withRouter } from 'react-router';

const propTypes = {
  history: PropTypes.object.isRequired,
  modalAriaHideApp: PropTypes.bool // for testing
};

const defaultProps = {
  modalAriaHideApp: true
};

function buildSubmitCallback({ modalState, serverApi, setModalState }) {
  return async function({ formDispatch, formState }) {
    try {
      const result = await serverApi.post({
        data: formState.values,
        route: 'signup'
      });

      const modalContent = (
        <Notice dismissable={false} type="success">
          {get(result, 'data.message')}
        </Notice>
      );

      return setModalState({ ...modalState, modalContent, showModal: true });
    } catch (error) {
      formDispatch({ type: 'submit:error', error });
      formDispatch({ type: 'submit:end' });
    }
  };
}

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .matches(/^\S+@\S+\.\S+$/, 'is invalid')
    .max(254, 'must be at most 254 characters'),
  password: yup.string().min(10, 'must be at least 10 characters'),
  username: yup.string().required('is required')
});

export function SignupForm({ history, modalAriaHideApp }) {
  const { serverApi } = useAppContext();
  const [modalState, setModalState] = useModal();

  const { formState, handleBlur, handleChange, handleSubmit } = useForm({
    fieldNames: ['email', 'password', 'username'],
    submitCallback: buildSubmitCallback({
      modalState,
      serverApi,
      setModalState
    }),
    validationSchema
  });

  const handleModalDismiss = () => history.push('/login');

  return (
    <>
      <div className="signup-form">
        <form onSubmit={handleSubmit}>
          {formState.error && (
            <Notice dismissable={false} type="alert">
              {formState.error}
            </Notice>
          )}

          <div className="signup-form-field">
            <div>
              <label htmlFor="username">Username</label>
            </div>
            <div className="form-field-input">
              <input
                className={formState.fieldErrors.username && 'field-has-error'}
                id="username"
                name="username"
                onBlur={handleBlur}
                onChange={handleChange}
                type="text"
                value={formState.values.username}
              />
            </div>
            {formState.fieldErrors.username && (
              <div
                className="form-field-error"
                data-testid="username-field-error"
              >
                Username {formState.fieldErrors.username}.
              </div>
            )}
          </div>

          <div className="signup-form-field">
            <div>
              <label htmlFor="email">Email</label>
            </div>
            <div className="signup-form-field-input">
              <input
                className={formState.fieldErrors.email && 'field-has-error'}
                id="email"
                inputMode="email"
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="smith@example.com"
                type="email"
                value={formState.values.email}
              />
            </div>
            {formState.fieldErrors.email && (
              <div className="form-field-error" data-testid="email-field-error">
                Email {formState.fieldErrors.email}.
              </div>
            )}
          </div>

          <div className="signup-form-field">
            <div>
              <label htmlFor="password">Password</label>
            </div>
            <div className="signup-form-field-input">
              <input
                className={formState.fieldErrors.password && 'field-has-error'}
                id="password"
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                type="password"
                value={formState.values.password}
              />
            </div>
            {formState.fieldErrors.password && (
              <div
                className="form-field-error"
                data-testid="password-field-error"
              >
                Password {formState.fieldErrors.password}.
              </div>
            )}
          </div>

          <div className="signup-form-button-wrapper">
            <button
              className="call-to-action"
              disabled={!formState.valid || formState.submitting}
              type="submit"
            >
              Sign up for FREE
            </button>
          </div>
        </form>
        <div className="login-link">
          Already signed up? <Link to="/login">Log in &rarr;</Link>
        </div>
      </div>
      <Modal
        ariaHideApp={modalAriaHideApp}
        handleDismiss={handleModalDismiss}
        isOpen={modalState.showModal}
        onRequestClose={handleModalDismiss}
      >
        {modalState.modalContent}
      </Modal>
    </>
  );
}

SignupForm.propTypes = propTypes;
SignupForm.defaultProps = defaultProps;

export default withRouter(SignupForm);
