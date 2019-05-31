import Login from './Login';
import React from 'react';
import SignupConfirmation from './SignupConfirmation';
import Todos from './Todos';
import Welcome from './Welcome';
import { Route, Switch } from 'react-router-dom';
import { ServicesContext, services } from './ServicesContext';

export function App() {
  return (
    <div className="app">
      <ServicesContext.Provider value={services}>
        <Switch>
          <Route exact path="/" component={Welcome} />
          <Route path="/login" component={Login} />
          <Route path="/signup-confirmation/:token" component={SignupConfirmation} />
          <Route path="/todos" component={Todos} />
          <Route path="/welcome" component={Welcome} />
        </Switch>
      </ServicesContext.Provider>
    </div>
  );
}

export default App;
