import cookie from 'cookie';
import { has } from 'lodash';

export function buildTitle(subtitle) {
  return `${subtitle} - App Name`;
}

export function isLoggedIn() {
  return has(cookie.parse(document.cookie), 'app_name_session');
}

