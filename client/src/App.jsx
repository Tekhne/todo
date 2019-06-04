import AppProvider from './AppProvider';
import Login from './Login';
import Navbar from './Navbar';
import React from 'react';
import SignupConfirmation from './SignupConfirmation';
import Todos from './Todos';
import Welcome from './Welcome';
import { Route, Switch } from 'react-router-dom';

export function App() {
  return (
    <div className="app">
      <AppProvider>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Welcome} />
          <Route path="/login" component={Login} />
          <Route path="/signup-confirmation/:token" component={SignupConfirmation} />
          <Route path="/todos" component={Todos} />
          <Route path="/welcome" component={Welcome} />
        </Switch>
      </AppProvider>
    </div>
  );
}

export default App;
