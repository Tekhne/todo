import PropTypes from 'prop-types';
import React, { useState } from 'react';

const propTypes = {
  children: PropTypes.node,
  dismissable: PropTypes.bool,
  type: PropTypes.oneOf(['alert', 'info', 'success', 'warn'])
};

const defaultProps = {
  children: null,
  dismissable: true,
  type: 'info'
};

export function Notice({ children, dismissable, type }) {
  const [state, setState] = useState({ dismissed: false });
  if (!children || state.dismissed) return null;
  const wrapperClassName = `notice notice-${type}`;
  const handleDismiss = () => setState({ ...state, dismissed: true });

  return (
    <div className={wrapperClassName} data-testid="notice">
      <div className="notice-content">{children}</div>
      {dismissable && (
        <div
          className="notice-dismiss"
          data-testid="notice-dismiss"
          onClick={handleDismiss}
          title="dismiss"
        >
          &times;
        </div>
      )}
    </div>
  );
}

Notice.propTypes = propTypes;
Notice.defaultProps = defaultProps;

export default Notice;
