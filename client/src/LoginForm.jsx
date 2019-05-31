import * as yup from 'yup';
import Notice from './Notice';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import ServicesContext from './ServicesContext';
import { useFormReducer } from './form-utils';
import { withRouter } from 'react-router';

const propTypes = {
  history: PropTypes.object.isRequired
};

const validationSchema = yup.object().shape({
  password: yup.string().required('is required'),
  username: yup.string().required('is required')
});

function buildSubmitCallback({ history, serverApi }) {
  return async function({ formDispatch, formState }) {
    try {
      await serverApi.post({ data: formState.values, route: 'login' });
      history.push('/todos');
    } catch (error) {
      formDispatch({ type: 'submit:error', error });
      formDispatch({ type: 'submit:end' });
    }
  };
}

export function LoginForm({ history }) {
  const { serverApi } = useContext(ServicesContext);

  const { formState, handleBlur, handleChange, handleSubmit } = useFormReducer({
    fieldNames: ['email', 'username'],
    submitCallback: buildSubmitCallback({ history, serverApi }),
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
    </div>
  );
}

LoginForm.propTypes = propTypes;

export default withRouter(LoginForm);
