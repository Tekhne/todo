import Content from './Content';
import NavbarMenu from './NavbarMenu';
import React from 'react';
import Viewport from './Viewport';
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <Viewport className="navbar-wrapper">
      <Content className="navbar">
        <span className="navbar-logo">
          <Link to="/">App Name</Link>
        </span>
        <span className="navbar-menu-wrapper"><NavbarMenu /></span>
      </Content>
    </Viewport>
  );
}

export default Navbar;
