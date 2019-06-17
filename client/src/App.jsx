import AppProvider from './AppProvider';
import Navbar from './Navbar';
import React from 'react';
import Routes from './Routes';

export function App() {
  return (
    <div className="app">
      <AppProvider>
        <Navbar />
        <Routes />
      </AppProvider>
    </div>
  );
}

export default App;
