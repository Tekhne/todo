import Notice from './Notice';
import React from 'react';
import ReactDOM from 'react-dom';
import { cleanup, fireEvent, render } from '@testing-library/react';

const { click } = fireEvent;

describe('Notice', function() {
  this.timeout(5000);

  function renderComponent(props = {}) {
    const p = { children: 'test', ...props };
    return render(<Notice {...p} />);
  }

  afterEach(cleanup);

  it('renders successfully', function() {
    const div = document.createElement('div');
    ReactDOM.render(<Notice />, div);
  });

  describe('when children prop is not given', function() {
    it('renders null', function() {
      const c = renderComponent({ children: null });
      expect(c.queryByTestId('notice')).not.toBeInTheDocument();
    });
  });

  describe('when component has been dismissed', function() {
    it('renders null', function() {
      const c = renderComponent();
      click(c.getByTestId('notice-dismiss'));
      expect(c.queryByTestId('notice')).not.toBeInTheDocument();
    });
  });

  it('renders visual elements based on given type prop', function() {
    const c = renderComponent({ type: 'alert' });
    expect(c.getByTestId('notice').className).toMatch('notice-alert');
  });

  describe('when component is not dismissable', function () {
    it('does not render dismiss element', function() {
      const c = renderComponent({ dismissable: false });
      expect(c.queryByTestId('notice-dismiss')).not.toBeInTheDocument();
    });
  });

  describe('when component is dismissable', function () {
    it('renders a dismiss element', function() {
      const c = renderComponent({ dismissable: true });
      expect(c.queryByTestId('notice-dismiss')).toBeInTheDocument();
    });
  });
});
