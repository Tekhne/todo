import React from 'react';
import ServerApi from './server-api';

export const services = {
  serverApi: new ServerApi()
};

export const ServicesContext = React.createContext();

export default ServicesContext;
