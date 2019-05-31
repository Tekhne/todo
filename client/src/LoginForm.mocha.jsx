import LoginForm from './LoginForm';
import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router';
import { ServicesContext } from './ServicesContext';
import { fake } from 'sinon';

describe('LoginForm', function() {
  it('renders successfully', function() {
    const container = document.createElement('div');
    const serverApi = { post: fake(() => Promise.resolve()) };

    ReactDOM.render(
      <ServicesContext.Provider value={{ serverApi }}>
        <MemoryRouter>
          <LoginForm />
        </MemoryRouter>
      </ServicesContext.Provider>,
      container
    );
  });

  // FIXME add more tests once Enzyme supports hooks
});
