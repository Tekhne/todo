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

export function Content({ className, children }) {
  const cn = compact(['content', className]).join(' ');
  return <span className={cn}>{children}</span>;
}

Content.propTypes = propTypes;
Content.defaultProps = defaultProps;

export default Content;
