import React from 'react';
import expect from 'expect';
import { Content } from './Content';
import { shallow } from 'enzyme';

function buildProps(props = {}) {
  return { ...props };
}

function buildComponent(props = {}) {
  return <Content {...buildProps(props)} />;
}

describe('Content', function() {
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
      expect(component.prop('className')).toEqual(`content ${className}`);
    });
  });
});
