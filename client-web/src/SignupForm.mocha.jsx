import React from 'react';
import ReactDOM from 'react-dom';
import SignupForm from './SignupForm';
import { ServicesContext } from './ServicesContext';
import {
  cleanup,
  fireEvent,
  render,
  waitForElement
} from 'react-testing-library';
import { fake } from 'sinon';
import { repeat } from 'lodash';

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

  function renderComponent({ services }) {
    const wrapper = buildWrapper({ services });
    return render(<SignupForm />, { wrapper });
  }

  function fill(input, value) {
    change(input, { target: { value } });
  }

  const submitText = 'Sign up for FREE';
  let services;

  beforeEach(function() {
    services = { serverApi: { send: fake.resolves() } };
  });

  afterEach(function() {
    cleanup();
  });

  it('renders successfully', () => {
    const Wrapper = buildWrapper({ services });
    const div = document.createElement('div');
    ReactDOM.render(
      <Wrapper>
        <SignupForm />
      </Wrapper>,
      div
    );
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
        await c.findByText('Email must be less than 254 characters.');
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
        await c.findByText('Email must be less than 254 characters.');
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

  describe('when user form submission succeeds', function() {
    // FIXME
  });

  describe('when user form submission fails', function() {
    // FIXME
  });
});
