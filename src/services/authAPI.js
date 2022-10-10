import {APIServices} from './APIServices';

export const onAuthenticate = payload => {
  return APIServices().makeRequest({
    url: '/auth/login',
    method: 'POST',
    data: payload,
  });
};

export const onLogout = () => {
  return APIServices().makeAuthRequest({
    url: '/auth/logout',
    method: 'POST',
  });
};

export const onRegister = payload => {
  return APIServices().makeRequest({
    url: '/auth/register',
    method: 'POST',
    data: payload,
  });
};
