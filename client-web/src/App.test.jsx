import React from 'react';
import { App } from './App';
import { shallow } from 'enzyme';

function buildProps(props = {}) {
  return { ...props };
}

function buildComponent(props = {}) {
  return <App {...buildProps(props)} />;
}

it('renders successfully', () => {
  shallow(buildComponent());
});
