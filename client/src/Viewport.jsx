import PropTypes from 'prop-types';
import React from 'react';
import { compact } from 'lodash';

const propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

const defaultProps = {
  children: null,
  className: null
};

export function Viewport({ className, children }) {
  const cn = compact(['viewport', className]).join(' ');
  return (
    <span className={cn} data-testid="viewport">
      {children}
    </span>
  );
}

Viewport.propTypes = propTypes;
Viewport.defaultProps = defaultProps;

export default Viewport;
