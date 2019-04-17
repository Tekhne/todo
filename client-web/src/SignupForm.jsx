import * as yup from 'yup';
import React, { useState } from 'react';
import api from './api';
import { every, isNull, omit } from 'lodash';

export function SignupForm({ localApi = api }) {
  const [state, setState] = useState({
    errors: { email: null, password: null, username: null },
    submittable: true,
    values: { email: '', password: '', username: '' }
  });

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .matches(/^\S+@\S+\.\S+$/, 'is invalid')
      .max(254, 'must be less than 254 characters'),
    password: yup
      .string()
      .min(10, 'must be at least 10 characters')
      .required('is required'),
    username: yup.string().required('is required')
  });

  const validateAll = async () => {
    try {
      await validationSchema.validate(state.values, { abortEarly: false });
      return null;
    } catch (exception) {
      return exception.inner.reduce(
        (es, e) => ({ ...es, [e.path]: e.message }),
        { ...state.errors }
      );
    }
  };

  const validateOne = async name => {
    try {
      await validationSchema.validateAt(name, state.values);
      return null;
    } catch (exception) {
      return { ...state.errors, [exception.path]: exception.message };
    }
  };

  const handleBlur = async event => {
    const { name } = event.target;
    const errors = await validateOne(name);

    if (errors) {
      setState({ ...state, errors, submittable: false });
      return;
    }
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setState({
      ...state,
      errors: { ...state.errors, [name]: null },
      values: { ...state.values, [name]: value },
      submittable: every(omit(state.errors, name), isNull) ? true : false
    });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (!state.submittable) return;
    setState({ ...state, submittable: false });
    const errors = await validateAll();

    if (errors) {
      setState({ ...state, errors, submittable: false });
      return;
    }

    try {
      await localApi.send('post', 'signup', state);
      // FIXME handle result
    } catch (error) {
      // FIXME handle error
    }

    setState({ ...state, submittable: true });
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
        <div className="signup-form-button">
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
