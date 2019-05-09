import React from 'react';
import ReactModal from 'react-modal';

import PropTypes from 'prop-types';

// Also see propTypes for ReactModal.
const propTypes = {
  handleDismiss: PropTypes.func
};

// Also see defaultProps for ReactModal.
const defaultProps = {
  handleDismiss: null
};

export function Modal({
  bodyOpenClassName = 'modal-body-open',
  children,
  className = 'modal-content',
  contentLabel = 'Modal',
  handleDismiss,
  htmlOpenClassName = 'modal-html-open',
  overlayClassName = 'modal-overlay',
  portalClassName = 'modal-portal',
  ...restProps
}) {
  return (
    <ReactModal
      bodyOpenClassName={bodyOpenClassName}
      className={className}
      contentLabel={contentLabel}
      htmlOpenClassName={htmlOpenClassName}
      overlayClassName={overlayClassName}
      portalClassName={portalClassName}
      {...restProps}
    >
      <div className="modal-inner-content">{children}</div>
      <div className="modal-dismiss-wrapper">
        <button onClick={handleDismiss} type="button">
          Dismiss
        </button>
      </div>
    </ReactModal>
  );
}

Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;

export default Modal;
