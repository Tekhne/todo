import React from 'react';
import expect from 'expect';
import { Welcome } from './Welcome';
import { shallow } from 'enzyme';

function buildProps(props = {}) {
  return { ...props };
}

function buildComponent(props = {}) {
  return <Welcome {...buildProps(props)} />;
}

describe('Welcome', () => {
  it('renders successfully', () => {
    shallow(buildComponent());
  });
});
