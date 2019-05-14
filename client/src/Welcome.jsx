import Content from './Content';
import React, { Fragment } from 'react';
import SignupForm from './SignupForm';
import Viewport from './Viewport';
import { Helmet } from 'react-helmet';

export function Welcome() {
  return (
    <Fragment>
      <Helmet>
        <title>Welcome - App Name</title>
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
    </Fragment>
  );
}

export default Welcome;
