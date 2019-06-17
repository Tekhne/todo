import Login from './Login';
import React from 'react';
import SignupConfirmation from './SignupConfirmation';
import Todos from './Todos';
import Welcome from './Welcome';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useAppContext } from './use-app-context';

export function AppRoutes() {
  const {
    authn: { authnState }
  } = useAppContext();

  if (authnState.isLoggedIn) {
    return (
      <Switch>
        <Route path="/todos" component={Todos} />
        <Route path="*" render={() => <Redirect to="/todos" />} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route exact path="/" component={Welcome} />
      <Route path="/login" component={Login} />
      <Route
        path="/signup-confirmation/:token"
        component={SignupConfirmation}
      />
      <Route path="/welcome" component={Welcome} />
      <Route path="*" render={() => <Redirect to="/" />} />
    </Switch>
  );
}

export default AppRoutes;
