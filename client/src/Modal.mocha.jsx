import Modal from './Modal';
import React from 'react';
import ReactDOM from 'react-dom';
import { assert, fake } from 'sinon';
import { cleanup, fireEvent, render } from '@testing-library/react';

const { click } = fireEvent;

describe('Modal', function() {
  this.timeout(5000);

  function renderComponent(props = {}) {
    const p = { ariaHideApp: false, isOpen: true, ...props };
    return render(<Modal {...p} />);
  }

  afterEach(cleanup);

  it('renders successfully', function() {
    const div = document.createElement('div');
    ReactDOM.render(<Modal />, div);
  });

  it('renders given children', function() {
    const text = 'test text';
    const children = <span>{text}</span>;
    const c = renderComponent({ children });
    c.getByText(text);
  });

  describe('when user clicks dismiss button', function() {
    it('calls given handleDismiss prop', function() {
      const handleDismiss = fake();
      const c = renderComponent({ handleDismiss });
      click(c.getByText('Dismiss'));
      assert.called(handleDismiss);
    });
  });
});
