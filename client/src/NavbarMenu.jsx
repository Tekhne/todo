import Modal from './Modal';
import Notice from './Notice';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { faBars, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { get } from 'lodash';
import { useAppContext } from './use-app-context';
import { useModal } from './use-modal';
import { withRouter } from 'react-router';

export function NavbarMenu({ history }) {
  const { authn, serverApi } = useAppContext();
  const { authnState, authnDispatch } = authn;
  const [showMenu, setShowMenu] = useState(false);
  const [modalState, setModalState] = useModal();

  useEffect(() => {
    const handleWindowClick = event => {
      if (!showMenu) return;
      const className = event.target.className;

      if (
        className !== 'navbar-menu-title' &&
        className !== 'navbar-menu-item'
      ) {
        setShowMenu(false);
      }
    };

    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  });

  if (!authnState.isLoggedIn) {
    return (
      <span className="navbar-menu">
        <Link to="/login">
          <FontAwesomeIcon icon={faSignInAlt} /> Log in
        </Link>
      </span>
    );
  }

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  const handleLogoutClick = async () => {
    try {
      await serverApi.delete({ route: 'login' });
      authnDispatch({ type: 'logout' });
      history.push('/login');
    } catch (error) {
      const modalContent = (
        <Notice dismissable={false} type="alert">
          {get(error, 'data.message')}
        </Notice>
      );

      setModalState({ modalContent, showModal: true });
    }
  };

  const handleModalDismiss = () => {
    setModalState({ modalContent: null, showModal: false });
  };

  return (
    <>
      <span className="navbar-menu">
        <span className="navbar-menu-title" onClick={handleMenuClick}>
          <FontAwesomeIcon icon={faBars} /> Menu
        </span>
        {showMenu && (
          <div className="navbar-menu-dropdown">
            <div className="navbar-menu-item" onClick={handleLogoutClick}>
              Log out
            </div>
          </div>
        )}
      </span>
      <Modal
        handleDismiss={handleModalDismiss}
        isOpen={modalState.showModal}
        onRequestClose={handleModalDismiss}
      >
        {modalState.modalContent}
      </Modal>
    </>
  );
}

export default withRouter(NavbarMenu);
