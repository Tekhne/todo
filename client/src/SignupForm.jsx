import * as yup from 'yup';
import React, { useContext, useState } from 'react';
import ServicesContext from './ServicesContext';
import { every, isNull, omit } from 'lodash';

const schema = yup.object().shape({
  email: yup
    .string()
    .matches(/^\S+@\S+\.\S+$/, 'is invalid')
    .max(254, 'must be less than 254 characters'),
  password: yup.string().min(10, 'must be at least 10 characters'),
  username: yup.string().required('is required')
});

async function validate({ name, schema, state }) {
  if (name) {
    try {
      await schema.validateAt(name, state.values);
      return null;
    } catch (exception) {
      return { ...state.errors, [exception.path]: exception.message };
    }
  }

  try {
    await schema.validate(state.values, { abortEarly: false });
    return null;
  } catch (exception) {
    return exception.inner.reduce((es, e) => ({ ...es, [e.path]: e.message }), {
      ...state.errors
    });
  }
}

export function SignupForm() {
  const { serverApi } = useContext(ServicesContext);

  const [state, setState] = useState({
    errors: { email: null, password: null, username: null },
    submittable: true,
    values: { email: '', password: '', username: '' }
  });

  const handleBlur = async event => {
    const { name } = event.target;
    const errors = await validate({ name, schema, state });
    if (errors) setState({ ...state, errors, submittable: false });
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setState({
      ...state,
      errors: { ...state.errors, [name]: null },
      values: { ...state.values, [name]: value },
      submittable: every(omit(state.errors, name), isNull)
    });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (!state.submittable) return;
    setState({ ...state, submittable: false });
    const errors = await validate({ schema, state });
    if (errors) return setState({ ...state, errors, submittable: false });

    try {
      await serverApi.post('signup', state);
      // FIXME handle result
    } catch (error) {
      // FIXME handle error
    }
  };

  return (
    <section className="signup-form">
      <form onSubmit={handleSubmit}>
        <div className="signup-form-field">
          <div>
            <label htmlFor="username">Username</label>
          </div>
          <div className="signup-form-field-input">
            <input
              className={state.errors.username && 'field-has-error'}
              id="username"
              name="username"
              onBlur={handleBlur}
              onChange={handleChange}
              type="text"
              value={state.values.username}
            />
          </div>
          {state.errors.username && (
            <div className="signup-form-field-error">
              Username {state.errors.username}.
            </div>
          )}
        </div>
        <div className="signup-form-field">
          <div>
            <label htmlFor="email">Email</label>
          </div>
          <div className="signup-form-field-input">
            <input
              className={state.errors.email && 'field-has-error'}
              id="email"
              inputMode="email"
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="smith@example.com"
              type="email"
              value={state.values.email}
            />
          </div>
          {state.errors.email && (
            <div className="signup-form-field-error">
              Email {state.errors.email}.
            </div>
          )}
        </div>
        <div className="signup-form-field">
          <div>
            <label htmlFor="password">Password</label>
          </div>
          <div className="signup-form-field-input">
            <input
              className={state.errors.password && 'field-has-error'}
              id="password"
              name="password"
              onBlur={handleBlur}
              onChange={handleChange}
              type="password"
              value={state.values.password}
            />
          </div>
          {state.errors.password && (
            <div className="signup-form-field-error">
              Password {state.errors.password}.
            </div>
          )}
        </div>
        <div className="signup-form-button-wrapper">
          <button
            className="call-to-action"
            disabled={!state.submittable}
            type="submit"
          >
            Sign up for FREE
          </button>
        </div>
      </form>
    </section>
  );
}

export default SignupForm;
