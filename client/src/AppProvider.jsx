import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import ServerApi from './ServerApi';
import { AppContext } from './app-context';
import { useAuthn } from './use-authn';

const propTypes = {
  props: PropTypes.object
};

const defaultProps = {
  props: {}
};

export function AppProvider(props) {
  const authn = useAuthn();
  const serverApi = new ServerApi();

  const value = useMemo(() => ({ authn, serverApi }), [authn, serverApi]);

  return <AppContext.Provider value={value} {...props} />;
}

AppProvider.propTypes = propTypes;
AppProvider.defaultProps = defaultProps;

export default AppProvider;
