import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router';
import { cleanup, render } from 'react-testing-library';

describe('App', function() {
  this.timeout(5000);

  function buildWrapper() {
    return ({ children }) => <MemoryRouter>{children}</MemoryRouter>;
  }

  function renderComponent() {
    const wrapper = buildWrapper();
    return render(<App />, { wrapper });
  }

  afterEach(cleanup);

  it('renders successfully', function() {
    const Wrapper = buildWrapper();
    const div = document.createElement('div');
    ReactDOM.render(
      <Wrapper>
        <App />
      </Wrapper>,
      div
    );
  });
});
