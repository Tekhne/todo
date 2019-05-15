import LoginForm from './LoginForm';
import React from 'react';
import { Helmet } from 'react-helmet';

export function Login() {
  return (
    <>
      <Helmet>
        <title>Login - App Name</title>
      </Helmet>
      <LoginForm />
    </>
  );
}

export default Login;
