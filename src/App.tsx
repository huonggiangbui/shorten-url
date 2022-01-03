import React from 'react';
import { Switch, Route } from 'react-router-dom';

import HomePage from './pages/';
// import RedirectPage from './pages/redirect';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        {/* <Route path="/:urlCode">
          <RedirectPage />
        </Route> */}
      </Switch>
    </div>
  );
}

export default App;
