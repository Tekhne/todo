import SignupConfirmation from './SignupConfirmation';
import React from 'react';
import ReactDOM from 'react-dom';

describe('SignupConfirmation', function() {
  it('renders successfully', function() {
    const container = document.createElement('div');
    ReactDOM.render(<SignupConfirmation />, container);
  });

  // FIXME add more tests once Enzyme supports hooks
});
