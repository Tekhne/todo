import React from 'react';
import expect from 'expect';
import { Viewport } from './Viewport';
import { shallow } from 'enzyme';

function buildProps(props = {}) {
  return { ...props };
}

function buildComponent(props = {}) {
  return <Viewport {...buildProps(props)} />;
}

describe('Viewport', function() {
  it('renders successfully', function() {
    shallow(buildComponent());
  });

  const children = 'test children';

  describe('when children prop is given', function() {
    it('renders children prop', function() {
      const component = shallow(buildComponent({ children }));
      expect(component.text()).toEqual(children);
    });
  });

  describe('when className prop is given', function() {
    it('renders given className', function() {
      const className = 'test-class test-class-2';
      const component = shallow(buildComponent({ className, children }));
      expect(component.prop('className')).toEqual(`viewport ${className}`);
    });
  });
});
