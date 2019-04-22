import React from 'react';
import Welcome from './Welcome';
import { Route, Switch } from 'react-router-dom';
import { ServicesContext, services } from './ServicesContext';

export function App() {
  return (
    <ServicesContext.Provider value={services}>
      <Switch>
        <Route exact path="/" component={Welcome} />
        <Route path="/welcome" component={Welcome} />
      </Switch>
    </ServicesContext.Provider>
  );
}

export default App;
