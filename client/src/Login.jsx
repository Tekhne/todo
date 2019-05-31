import Content from './Content';
import LoginForm from './LoginForm';
import React from 'react';
import Viewport from './Viewport';
import { Helmet } from 'react-helmet';
import { buildTitle } from './utils';

export function Login() {
  return (
    <>
      <Helmet>
        <title>{buildTitle('Login')}</title>
      </Helmet>
      <Viewport>
        <Content className="login">
          <section className="login-form-wrapper">
            <h1>Login</h1>
            <LoginForm />
          </section>
        </Content>
      </Viewport>
    </>
  );
}

export default Login;
