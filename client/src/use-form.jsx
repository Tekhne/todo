import { every, get, isNull, mapValues, omit, set } from 'lodash';
import { useReducer } from 'react';

async function validate({ formState, name, validationSchema }) {
  if (name) {
    try {
      await validationSchema.validateAt(name, formState.values);
      return null;
    } catch (exception) {
      return { ...formState.fieldErrors, [exception.path]: exception.message };
    }
  }

  try {
    await validationSchema.validate(formState.values, { abortEarly: false });
    return null;
  } catch (exception) {
    return exception.inner.reduce((es, e) => ({ ...es, [e.path]: e.message }), {
      ...formState.fieldErrors
    });
  }
}

function buildHandleBlur({ formDispatch, formState, validationSchema }) {
  return async function(event) {
    if (validationSchema) {
      const { name } = event.target;
      const fieldErrors = await validate({ name, validationSchema, formState });
      if (fieldErrors) formDispatch({ type: 'field:errors', fieldErrors });
    }
  };
}

function buildHandleChange({ formDispatch }) {
  return function(event) {
    const { name, value } = event.target;
    formDispatch({ type: 'field:change', name, value });
  };
}

function buildHandleSubmit({
  formDispatch,
  formState,
  submitCallback,
  validationSchema
}) {
  return async function(event) {
    event.preventDefault();
    formDispatch({ type: 'submit:start' });

    if (validationSchema) {
      const fieldErrors = await validate({ formState, validationSchema });

      if (fieldErrors) {
        formDispatch({ type: 'field:errors', fieldErrors });
        formDispatch({ type: 'submit:end' });
        return;
      }
    }

    if (submitCallback)
      await submitCallback({ formDispatch, formState, validationSchema });
  };
}

function formReducer(state, action) {
  switch (action.type) {
    case 'field:change':
      return {
        ...state,
        error: null,
        fieldErrors: { ...state.fieldErrors, [action.name]: null },
        valid: every(omit(state.fieldErrors, action.name), isNull),
        values: { ...state.values, [action.name]: action.value }
      };
    case 'field:errors':
      const { fieldErrors } = action;
      return { ...state, fieldErrors, valid: false };
    case 'submit:end':
      return { ...state, submitting: false };
    case 'submit:error':
      const { error } = action;
      return {
        ...state,
        error: getErrorMessage(error),
        fieldErrors: getFirstOfFieldErrors(error),
        valid: true
      };
    case 'submit:start':
      return { ...state, submitting: true };
    default:
      throw new Error(`unknown reducer action type: ${action.type}`);
  }
}

function formReducerInit(names) {
  return {
    error: null,
    fieldErrors: names.reduce((a, v) => set(a, v, null), {}),
    submitting: false,
    valid: true,
    values: names.reduce((a, v) => set(a, v, ''), {})
  };
}

function getErrorMessage(error) {
  return get(error, 'data.message');
}

function getFirstOfFieldErrors(error) {
  const errors = get(error, 'data.fieldErrors') || {};
  return mapValues(errors, v => v[0]);
}

export function useForm({
  fieldNames,
  submitCallback,
  validationSchema
}) {
  const [formState, formDispatch] = useReducer(
    formReducer,
    fieldNames,
    formReducerInit
  );

  const handleBlur = buildHandleBlur({
    formDispatch,
    formState,
    validationSchema
  });

  const handleChange = buildHandleChange({ formDispatch });

  const handleSubmit = buildHandleSubmit({
    formDispatch,
    formState,
    submitCallback,
    validationSchema
  });

  return { formDispatch, formState, handleBlur, handleChange, handleSubmit };
}
