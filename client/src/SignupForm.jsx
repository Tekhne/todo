import * as yup from 'yup';
import Modal from './Modal';
import Notice from './Notice';
import PropTypes from 'prop-types';
import React, { Fragment, useContext, useState } from 'react';
import ServicesContext from './ServicesContext';
import { every, get, isNull, mapValues, omit, set } from 'lodash';
import { withRouter } from 'react-router';

const propTypes = {
  history: PropTypes.object.isRequired,
  modalAriaHideApp: PropTypes.bool
};

const defaultProps = {
  modalAriaHideApp: true
};

function getErrorMessage(error) {
  /* istanbul ignore next */
  return (
    get(error, 'response.data.message') || error.message || 'An error occurred.'
  );
}

function getFirstOfFieldErrors(error) {
  /* istanbul ignore next */
  const errors = get(error, 'response.data.fieldErrors') || {};
  return mapValues(errors, v => v[0]);
}

async function validate({ name, schema, formState }) {
  if (name) {
    try {
      await schema.validateAt(name, formState.values);
      return null;
    } catch (exception) {
      return { ...formState.fieldErrors, [exception.path]: exception.message };
    }
  }

  try {
    await schema.validate(formState.values, { abortEarly: false });
    return null;
  } catch (exception) {
    return exception.inner.reduce((es, e) => ({ ...es, [e.path]: e.message }), {
      ...formState.fieldErrors
    });
  }
}

function useForm(names) {
  return useState({
    error: null,
    fieldErrors: names.reduce((a, v) => set(a, v, null), {}),
    valid: true,
    values: names.reduce((a, v) => set(a, v, ''), {})
  });
}

function useModal() {
  return useState({
    modalContent: null,
    showModal: false
  });
}

function buildHandleBlur({ schema, setFormState, formState }) {
  return async function(event) {
    const { name } = event.target;
    const fieldErrors = await validate({ name, schema, formState });

    if (fieldErrors) setFormState({ ...formState, fieldErrors, valid: false });
  };
}

function buildHandleChange({ setFormState, formState }) {
  return function(event) {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      error: null,
      fieldErrors: { ...formState.fieldErrors, [name]: null },
      valid: every(omit(formState.fieldErrors, name), isNull),
      values: { ...formState.values, [name]: value }
    });
  };
}

function buildHandleSubmit({ callback, formState, setFormState }) {
  return async function(event) {
    event.preventDefault();

    await setFormState({
      ...formState,
      error: null,
      fieldErrors: {},
      valid: false
    });

    const fieldErrors = await validate({ schema, formState });

    if (fieldErrors) {
      return setFormState({ ...formState, fieldErrors, valid: false });
    }

    await callback();
  };
}

function buildSubmitCallback({
  formState,
  modalState,
  serverApi,
  setFormState,
  setModalState
}) {
  return async function() {
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
      return setFormState({
        ...formState,
        error: getErrorMessage(error),
        fieldErrors: getFirstOfFieldErrors(error),
        valid: true
      });
    }
  };
}

const schema = yup.object().shape({
  email: yup
    .string()
    .matches(/^\S+@\S+\.\S+$/, 'is invalid')
    .max(254, 'must be at most 254 characters'),
  password: yup.string().min(10, 'must be at least 10 characters'),
  username: yup.string().required('is required')
});

export function SignupForm({ history, modalAriaHideApp }) {
  const { serverApi } = useContext(ServicesContext);

  const [formState, setFormState] = useForm(['email', 'password', 'username']);
  const [modalState, setModalState] = useModal();

  const handleBlur = buildHandleBlur({ schema, setFormState, formState });
  const handleChange = buildHandleChange({ setFormState, formState });
  const callback = buildSubmitCallback({
    formState,
    modalState,
    serverApi,
    setFormState,
    setModalState
  });
  const handleSubmit = buildHandleSubmit({ callback, setFormState, formState });

  const handleModalDismiss = () => history.push('/login');

  return (
    <Fragment>
      <section className="signup-form">
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
            <div className="signup-form-field-input">
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
                className="signup-form-field-error"
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
              <div
                className="signup-form-field-error"
                data-testid="email-field-error"
              >
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
                className="signup-form-field-error"
                data-testid="password-field-error"
              >
                Password {formState.fieldErrors.password}.
              </div>
            )}
          </div>
          <div className="signup-form-button-wrapper">
            <button
              className="call-to-action"
              disabled={!formState.valid}
              type="submit"
            >
              Sign up for FREE
            </button>
          </div>
        </form>
      </section>
      <Modal
        ariaHideApp={modalAriaHideApp}
        handleDismiss={handleModalDismiss}
        isOpen={modalState.showModal}
        onRequestClose={handleModalDismiss}
      >
        {modalState.modalContent}
      </Modal>
    </Fragment>
  );
}

SignupForm.propTypes = propTypes;
SignupForm.defaultProps = defaultProps;

export default withRouter(SignupForm);
