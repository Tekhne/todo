import AppProvider from './AppProvider';
import Navbar from './Navbar';
import React from 'react';
import Routes from './Routes';

export function App() {
  return (
    <AppProvider>
      <div className="app">
        <Navbar />
        <Routes />
      </div>
    </AppProvider>
  );
}

export default App;
