import Todos from './Todos';
import React from 'react';
import ReactDOM from 'react-dom';

describe('Todos', function() {
  it('renders successfully', function() {
    const container = document.createElement('div');
    ReactDOM.render(<Todos />, container);
  });

  // FIXME add more tests once Enzyme supports hooks
});
