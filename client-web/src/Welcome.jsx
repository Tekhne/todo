import Content from './Content';
import React from 'react';
import Viewport from './Viewport';

export function Welcome() {
  return (
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
              It's simple. It works. It will transform your results.
            </h2>
          </section>
          <section className="hero-form">
            <form>
              <div className="hero-form-field">
                <div>
                  <label htmlFor="username">Username</label>
                </div>
                <div className="hero-form-field-input">
                  <input
                    id="username"
                    name="username"
                    placeholder="smithuser"
                    type="text"
                    value=""
                  />
                </div>
              </div>
              <div className="hero-form-field">
                <div>
                  <label htmlFor="email">Email</label>
                </div>
                <div className="hero-form-field-input">
                  <input
                    id="email"
                    inputMode="email"
                    name="email"
                    placeholder="smith@example.com"
                    type="email"
                    value=""
                  />
                </div>
              </div>
              <div className="hero-form-field">
                <div>
                  <label htmlFor="password">Password</label>
                </div>
                <div className="hero-form-field-input">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value=""
                  />
                </div>
              </div>
              <div className="hero-form-button">
                <button className="call-to-action" type="submit">
                  Sign up for FREE
                </button>
              </div>
            </form>
          </section>
        </div>
      </Content>
    </Viewport>
  );
}

export default Welcome;
