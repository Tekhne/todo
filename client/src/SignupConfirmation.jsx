import Content from './Content';
import Modal from './Modal';
import Notice from './Notice';
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import ServicesContext from './ServicesContext';
import Viewport from './Viewport';
import { get } from 'lodash';
import { withRouter } from 'react-router';

const propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export function SignupConfirmation({ history, match }) {
  const { serverApi } = useContext(ServicesContext);

  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function confirm() {
      try {
        await serverApi.send({
          data: { token: match.params.token },
          method: 'patch',
          route: 'signupConfirmation'
        });

        setConfirmed(true);
      } catch (error) {
        setError(get(error, 'data.message') || 'An unexpected error occurred.');
      }
    }

    confirm();
  }, [match.params.token, serverApi]);

  const handleModalDismiss = () => history.push('/login');

  if (confirmed) {
    return (
      <Modal
        handleDismiss={handleModalDismiss}
        isOpen={true}
        onRequestClose={handleModalDismiss}
      >
        <Notice dismissable={false} type="success">
          You're account was successfully confirmed.
        </Notice>
      </Modal>
    );
  }

  if (error) {
    return (
      <Viewport>
        <Content>
          <Notice dismissable={false} type="alert">
            <p>{error}</p>
            <p>You can try reloading the page or signing up again.</p>
          </Notice>
        </Content>
      </Viewport>
    );
  }

  return (
    <Viewport>
      <Content>
        <p>Confirming your account ...</p>
      </Content>
    </Viewport>
  );
}

SignupConfirmation.propTypes = propTypes;

export default withRouter(SignupConfirmation);
