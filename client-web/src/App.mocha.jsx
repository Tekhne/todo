import React from 'react';
import Welcome from './Welcome';
import expect from 'expect';
import { App } from './App';
import { Route, Switch } from 'react-router-dom';
import { shallow } from 'enzyme';

function buildProps(props = {}) {
  return { ...props };
}

function buildComponent(props = {}) {
  return <App {...buildProps(props)} />;
}

describe('App', function () {
  it('renders successfully', function() {
    shallow(buildComponent());
  });

  it('renders Switch', function() {
    const component = shallow(buildComponent());
    expect(component.exists(Switch)).toBeTruthy();
  });

  it('renders Route for "/" path', function() {
    const component = shallow(buildComponent());
    const route = component.find(Route).findWhere(n => n.prop('path') === '/');
    expect(route.props()).toMatchObject({ exact: true, component: Welcome });
  });

  it('renders Route for "/welcome" path', function() {
    const component = shallow(buildComponent());
    const route = component
      .find(Route)
      .findWhere(n => n.prop('path') === '/welcome');
    expect(route.props()).toMatchObject({ component: Welcome });
  });
});
