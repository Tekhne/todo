import * as yup from 'yup';
import Notice from './Notice';
import PropTypes from 'prop-types';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useAppContext } from './use-app-context';
import { useForm } from './use-form';
import { withRouter } from 'react-router';

const propTypes = {
  authnDispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  serverApi: PropTypes.object.isRequired
};

const validationSchema = yup.object().shape({
  password: yup.string().required('is required'),
  username: yup.string().required('is required')
});

function buildSubmitCallback({ authnDispatch, history, serverApi }) {
  return async function({ formDispatch, formState }) {
    try {
      await serverApi.post({ data: formState.values, route: 'login' });
      authnDispatch({ type: 'login' });
      history.push('/todos');
    } catch (error) {
      formDispatch({ type: 'submit:error', error });
      formDispatch({ type: 'submit:end' });
    }
  };
}

export function LoginForm({ history }) {
  const {
    authn: { authnDispatch },
    serverApi
  } = useAppContext();

  const { formState, handleBlur, handleChange, handleSubmit } = useForm({
    fieldNames: ['email', 'username'],
    submitCallback: buildSubmitCallback({ authnDispatch, history, serverApi }),
    validationSchema
  });

  return (
    <div className="login-form">
      <form onSubmit={handleSubmit}>
        {formState.error && (
          <Notice dismissable={false} type="alert">
            {formState.error}
          </Notice>
        )}

        <div className="form-field">
          <div>
            <label htmlFor="username">Username</label>
          </div>
          <div className="form-field-input-wrapper">
            <input
              className={formState.fieldErrors.username && 'field-has-error'}
              id="username"
              name="username"
              onBlur={handleBlur}
              onChange={handleChange}
              type="text"
              value={formState.username}
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

        <div className="form-field">
          <div>
            <label htmlFor="password">Password</label>
          </div>
          <div className="form-field-input-wrapper">
            <input
              className={formState.fieldErrors.password && 'field-has-error'}
              id="password"
              name="password"
              onBlur={handleBlur}
              onChange={handleChange}
              type="password"
              value={formState.password}
            />
          </div>
          {formState.fieldErrors.password && (
            <div
              className="form-field-error"
              data-testid="username-field-error"
            >
              Password {formState.fieldErrors.password}.
            </div>
          )}
        </div>

        <div className="form-button-wrapper">
          <button
            className="call-to-action"
            disabled={!formState.valid || formState.submitting}
            type="submit"
          >
            Log in
          </button>
        </div>
      </form>
      <div className="signup-link">
        Don't have an account?{' '}
        <Link to="/welcome">
          <FontAwesomeIcon icon={faUserPlus} /> Sign up
        </Link>
      </div>
    </div>
  );
}

LoginForm.propTypes = propTypes;

export default withRouter(LoginForm);
