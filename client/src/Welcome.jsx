import Content from './Content';
import React from 'react';
import SignupForm from './SignupForm';
import Viewport from './Viewport';
import { Helmet } from 'react-helmet';
import { buildTitle } from './utils';

export function Welcome() {
  return (
    <>
      <Helmet>
        <title>{buildTitle('Welcome')}</title>
      </Helmet>
      <Viewport>
        <Content className="welcome">
          <div className="hero">
            <section className="hero-headers">
              <h1 className="hero-header">
                <span>Todo List</span>{' '}
                <span>
                  <span className="hero-header-plus">+</span> Day Planner
                </span>
              </h1>
              <h2 className="hero-subheader">
                It's simple. It works. Boost your productivity.
              </h2>
            </section>
            <SignupForm />
          </div>
        </Content>
      </Viewport>
    </>
  );
}

export default Welcome;
