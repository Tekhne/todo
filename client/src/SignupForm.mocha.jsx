import React from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import { ServicesContext } from './ServicesContext';
import { SignupForm } from './SignupForm';
import {
  cleanup,
  fireEvent,
  render,
  wait,
  waitForElement
} from 'react-testing-library';
import { assert, fake } from 'sinon';
import { get, repeat } from 'lodash';

const { blur, change, click } = fireEvent;

describe('SignupForm', function() {
  this.timeout(5000);

  function buildWrapper({ services }) {
    return ({ children }) => (
      <ServicesContext.Provider value={services}>
        {children}
      </ServicesContext.Provider>
    );
  }

  function renderComponent({ props = {}, services }) {
    const wrapper = buildWrapper({ services });
    const p = {
      history: { push: () => {} },
      modalAriaHideApp: false,
      ...props
    };
    return render(<SignupForm {...p} />, { wrapper });
  }

  function fill(input, value) {
    change(input, { target: { value } });
  }

  const submissionMessage = 'Test submission message';
  const submissionSuccess = { data: { message: submissionMessage } };
  const submitText = 'Sign up for FREE';
  let services;

  beforeEach(function() {
    services = {
      serverApi: { post: fake.resolves(submissionSuccess) }
    };
  });

  afterEach(function() {
    cleanup();
  });

  it('renders successfully', () => {
    const history = { push: fake() };
    const Wrapper = buildWrapper({ services });
    const div = document.createElement('div');
    ReactDOM.render(
      <Wrapper>
        <SignupForm history={history} />
      </Wrapper>,
      div
    );
  });

  describe('when user enters a valid username', function() {
    describe('when user blurs username field', function() {
      it('does not render a username field error', async function() {
        const c = renderComponent({ services });
        const field = c.getByLabelText('Username');
        blur(field);
        await c.findByTestId('username-field-error');
        fill(field, 'smith');
        blur(field);
        await wait(() => {
          expect(
            c.queryByTestId('username-field-error')
          ).not.toBeInTheDocument();
        });
      });
    });
  });

  describe('when user leaves username field blank', function() {
    describe('when user submits form', function() {
      it('renders username field error', async function() {
        const c = renderComponent({ services });
        click(c.getByText(submitText));
        await c.findByText('Username is required.');
      });

      it('renders disabled submit button', async function() {
        const c = renderComponent({ services });
        click(c.getByText(submitText));
        const button = await c.findByText(submitText);
        expect(button).toHaveAttribute('disabled');
      });
    });

    describe('when user blurs username field', function() {
      it('renders username field error', async function() {
        const c = renderComponent({ services });
        blur(c.getByLabelText('Username'));
        await c.findByText('Username is required.');
      });

      it('renders disabled submit button', async function() {
        const c = renderComponent({ services });
        blur(c.getByLabelText('Username'));
        await c.findByText(submitText, { selector: '[disabled]' });
      });
    });
  });

  describe('when user enters a valid email', function() {
    describe('when user blurs email field', function() {
      it('does not render a email field error', async function() {
        const c = renderComponent({ services });
        const field = c.getByLabelText('Email');
        blur(field);
        await c.findByTestId('email-field-error');
        fill(field, 'smith@example.com');
        blur(field);
        await wait(() => {
          expect(c.queryByTestId('email-field-error')).not.toBeInTheDocument();
        });
      });
    });
  });

  describe('when user fills email field with invalid email address', function() {
    describe('when user submits form', function() {
      it('renders email field error', async function() {
        const c = renderComponent({ services });
        const email = 'invalid';
        fill(c.getByLabelText('Email'), email);
        await c.findByDisplayValue(email);
        click(c.getByText(submitText));
        await c.findByText('Email is invalid.');
      });

      it('renders disabled submit button', async function() {
        const c = renderComponent({ services });
        const email = 'invalid';
        fill(c.getByLabelText('Email'), email);
        await c.findByDisplayValue(email);
        click(c.getByText(submitText));
        await c.findByText(submitText, { selector: '[disabled]' });
      });
    });

    describe('when user blurs email field', function() {
      it('renders email field error', async function() {
        const c = renderComponent({ services });
        const email = 'invalid';
        const input = c.getByLabelText('Email');
        fill(input, email);
        await c.findByDisplayValue(email);
        blur(input);
        await c.findByText('Email is invalid.');
      });

      it('renders disabled submit button', async function() {
        const c = renderComponent({ services });
        const email = 'invalid';
        const input = c.getByLabelText('Email');
        fill(input, email);
        await c.findByDisplayValue(email);
        blur(input);
        await c.findByText(submitText, { selector: '[disabled]' });
      });
    });
  });

  describe('when user fills email field with 255 or more characters', function() {
    describe('when user submits form', function() {
      it('renders email field error', async function() {
        const c = renderComponent({ services });
        const email = repeat('a', 243) + '@example.com';
        fill(c.getByLabelText('Email'), email);
        await c.findByDisplayValue(email);
        click(c.getByText(submitText));
        await c.findByText('Email must be at most 254 characters.');
      });

      it('renders disabled submit button', async function() {
        const c = renderComponent({ services });
        const email = repeat('a', 243) + '@example.com';
        fill(c.getByLabelText('Email'), email);
        await c.findByDisplayValue(email);
        click(c.getByText(submitText));
        await c.findByText(submitText, { selector: '[disabled]' });
      });
    });

    describe('when user blurs email field', function() {
      it('renders email field error', async function() {
        const c = renderComponent({ services });
        const input = c.getByLabelText('Email');
        const email = repeat('a', 243) + '@example.com';
        fill(input, email);
        await c.findByDisplayValue(email);
        blur(input);
        await c.findByText('Email must be at most 254 characters.');
      });

      it('renders disabled submit button', async function() {
        const c = renderComponent({ services });
        const input = c.getByLabelText('Email');
        const email = repeat('a', 243) + '@example.com';
        fill(input, email);
        await c.findByDisplayValue(email);
        blur(input);
        await c.findByText(submitText, { selector: '[disabled]' });
      });
    });
  });

  describe('when user enters a valid password', function() {
    describe('when user blurs password field', function() {
      it('does not render a password field error', async function() {
        const c = renderComponent({ services });
        const field = c.getByLabelText('Password');
        blur(field);
        await c.findByTestId('password-field-error');
        fill(field, 'aS3cr3t!Passw0rd');
        blur(field);
        await wait(() => {
          expect(
            c.queryByTestId('password-field-error')
          ).not.toBeInTheDocument();
        });
      });
    });
  });

  describe('when user fills password field with less than 10 characters', function() {
    describe('when user submits form', function() {
      it('renders password field error', async function() {
        const c = renderComponent({ services });
        const password = repeat('a', 9);
        fill(c.getByLabelText('Password'), password);
        await c.findByDisplayValue(password);
        click(c.getByText(submitText));
        await c.findByText('Password must be at least 10 characters.');
      });

      it('renders disabled submit button', async function() {
        const c = renderComponent({ services });
        const password = repeat('a', 9);
        fill(c.getByLabelText('Password'), password);
        await c.findByDisplayValue(password);
        click(c.getByText(submitText));
        await c.findByText(submitText, { selector: '[disabled]' });
      });
    });

    describe('when user blurs password field', function() {
      it('renders password field error', async function() {
        const c = renderComponent({ services });
        const password = repeat('a', 9);
        const input = c.getByLabelText('Password');
        fill(input, password);
        await c.findByDisplayValue(password);
        blur(input);
        await c.findByText('Password must be at least 10 characters.');
      });

      it('renders disabled submit button', async function() {
        const c = renderComponent({ services });
        const password = repeat('a', 9);
        const input = c.getByLabelText('Password');
        fill(input, password);
        await c.findByDisplayValue(password);
        blur(input);
        await c.findByText(submitText, { selector: '[disabled]' });
      });
    });
  });

  describe('when user submits form with valid fields', function() {
    it('renders disabled submit button during submission', async function() {
      const c = renderComponent({ services });
      fill(c.getByLabelText('Username'), 'smitherson');
      fill(c.getByLabelText('Email'), 'smith@example.com');
      fill(c.getByLabelText('Password'), 'secretpassword');
      click(c.getByText(submitText));
      await c.findByText(submitText, { selector: '[disabled]' });
    });
  });

  describe('when user successfully submits the form', function() {
    function submitForm(...args) {
      const c = renderComponent(...args);
      fill(c.getByLabelText('Username'), 'smitherson');
      fill(c.getByLabelText('Email'), 'smith@example.com');
      fill(c.getByLabelText('Password'), 'secretpassword');
      click(c.getByText(submitText));
      return c;
    }

    describe('when the response is a success', function() {
      it('renders a success modal with success message', async function() {
        const c = submitForm({ services });
        await c.findByTestId('modal-inner-content');
        c.getByText(submissionMessage);
      });

      describe('when user dismisses success modal', function() {
        it('navigates user to login', async function() {
          const props = { history: { push: fake() } };
          const c = submitForm({ props, services });
          await c.findByTestId('modal-inner-content');
          click(c.getByText('Dismiss'));
          assert.called(props.history.push);
        });
      });
    });

    describe('when the response is a failure', function() {
      const error = {
        response: {
          data: {
            fieldErrors: {
              username: ['is invalid #1', 'is invalid #2']
            },
            message: 'test error'
          }
        }
      };

      beforeEach(function() {
        services = { serverApi: { post: fake(() => Promise.reject(error)) } };
      });

      it('enables the form submission button', async function() {
        const c = submitForm({ services });
        await c.findByText(submitText, { selector: ':not([disabled])' });
      });

      describe('when response has a form error', function() {
        it('renders the form error', async function() {
          const c = submitForm({ services });
          await c.findByText(error.response.data.message);
        });
      });

      describe('when response has field errors', function() {
        it('renders the field errors', async function() {
          const c = submitForm({ services });
          await c.findByText(
            `Username ${error.response.data.fieldErrors.username[0]}.`
          );
        });
      });
    });
  });
});
