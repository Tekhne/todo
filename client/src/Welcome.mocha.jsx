import React from 'react';
import ReactDOM from 'react-dom';
import Welcome from './Welcome';
import { MemoryRouter } from 'react-router';
import { ServicesContext } from './ServicesContext';
import { cleanup, render } from '@testing-library/react';
import { fake } from 'sinon';

describe('Welcome', function() {
  this.timeout(5000);

  function buildWrapper({ services }) {
    return ({ children }) => (
      <MemoryRouter>
        <ServicesContext.Provider value={services}>
          {children}
        </ServicesContext.Provider>
      </MemoryRouter>
    );
  }

  function renderComponent(props = {}) {
    const wrapper = buildWrapper({ services });
    return render(<Welcome {...props} />, { wrapper });
  }

  let services;

  beforeEach(function() {
    services = { serverApi: { send: fake.resolves() } };
  });

  afterEach(cleanup);

  it('renders successfully', function() {
    const Wrapper = buildWrapper({ services });
    const div = document.createElement('div');
    ReactDOM.render(
      <Wrapper>
        <Welcome />
      </Wrapper>,
      div
    );
  });
});
