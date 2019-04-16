import Content from './Content';
import React from 'react';
import Viewport from './Viewport';
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

  it('renders Viewport', function() {
    const component = shallow(buildComponent()).find(Viewport);
    expect(component.exists).toBeTruthy();
  });

  it('renders Content', function() {
    const component = shallow(buildComponent()).find(Content);
    expect(component.exists).toBeTruthy();
  });
});
