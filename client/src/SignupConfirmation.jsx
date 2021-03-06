import Content from './Content';
import Helmet from 'react-helmet';
import Modal from './Modal';
import Notice from './Notice';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Viewport from './Viewport';
import { buildTitle } from './utils';
import { get } from 'lodash';
import { useAppContext } from './use-app-context';
import { withRouter } from 'react-router';

const propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export function SignupConfirmation({ history, match }) {
  const { serverApi } = useAppContext();

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
      <>
        <Helmet>
          <title>{buildTitle('Signup Confirmation')}</title>
        </Helmet>
        <Modal
          handleDismiss={handleModalDismiss}
          isOpen={true}
          onRequestClose={handleModalDismiss}
        >
          <Notice dismissable={false} type="success">
            You're account was successfully confirmed.
          </Notice>
        </Modal>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>{buildTitle('Signup Confirmation')}</title>
        </Helmet>
        <Viewport>
          <Content>
            <Notice dismissable={false} type="alert">
              <p>{error}</p>
              <p>You can try reloading the page or signing up again.</p>
            </Notice>
          </Content>
        </Viewport>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{buildTitle('Signup Confirmation')}</title>
      </Helmet>
      <Viewport>
        <Content>
          <p>Confirming your account ...</p>
        </Content>
      </Viewport>
    </>
  );
}

SignupConfirmation.propTypes = propTypes;

export default withRouter(SignupConfirmation);
