import React from 'react';
import { SignupForm } from './SignupForm';
import { shallow } from 'enzyme';

function buildProps(props = {}) {
  return { ...props };
}

function buildComponent(props = {}) {
  return <SignupForm {...buildProps(props)} />;
}

describe('SignupForm', function() {
  it('renders successfully', function() {
    shallow(buildComponent());
  });
});
