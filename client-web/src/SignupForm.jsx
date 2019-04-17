import React from 'react';

export function SignupForm() {
  return (
    <section className="signup-form">
      <form>
        <div className="signup-form-field">
          <div>
            <label htmlFor="username">Username</label>
          </div>
          <div className="signup-form-field-input">
            <input
              id="username"
              name="username"
              placeholder="smitherson"
              type="text"
              value=""
            />
          </div>
        </div>
        <div className="signup-form-field">
          <div>
            <label htmlFor="email">Email</label>
          </div>
          <div className="signup-form-field-input">
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
        <div className="signup-form-field">
          <div>
            <label htmlFor="password">Password</label>
          </div>
          <div className="signup-form-field-input">
            <input id="password" name="password" type="password" value="" />
          </div>
        </div>
        <div className="signup-form-button">
          <button className="call-to-action" type="submit">
            Sign up for FREE
          </button>
        </div>
      </form>
    </section>
  );
}

export default SignupForm;
