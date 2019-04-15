import React from 'react';
import Welcome from './Welcome';
import { Route, Switch } from 'react-router-dom';

export function App() {
  return (
    <Switch>
      <Route exact path="/" component={Welcome} />
      <Route path="/welcome" component={Welcome} />
    </Switch>
  );
}

export default App;
