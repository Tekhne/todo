import React from 'react';
import ReactDOM from 'react-dom';
import Content from './Content';
import { cleanup, render } from 'react-testing-library';

describe('Content', function() {
  this.timeout(5000);

  function renderComponent(props = {}) {
    return render(<Content {...props} />);
  }

  afterEach(cleanup);

  it('renders successfully', function() {
    const div = document.createElement('div');
    ReactDOM.render(<Content />, div);
  });

  const text = 'test children';

  describe('when children prop is given', function() {
    it('renders given children prop', function() {
      const c = renderComponent({ children: text });
      expect(c.getByText(text)).toBeInTheDocument();
    });
  });

  describe('when className prop is given', function() {
    it('renders given className prop', function() {
      const className = 'test-class test-class-2';
      const c = renderComponent({ className, children: text });
      expect(c.getByTestId('content').className).toMatch(className);
    });
  });
});
