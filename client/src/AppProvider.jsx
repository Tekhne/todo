import React, { useMemo } from 'react';
import ServerApi from './ServerApi';
import { AppContext } from './app-context';
import { useAuthn } from './use-authn';

export function AppProvider(props) {
  const authn = useAuthn();
  const serverApi = new ServerApi();

  const value = useMemo(() => ({ authn, serverApi }), [authn, serverApi]);

  return <AppContext.Provider value={value} {...props} />;
}

export default AppProvider;
