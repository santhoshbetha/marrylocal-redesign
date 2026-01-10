import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SimpleCrypto from 'simple-crypto-js';
import { logout } from '../store/actions/authActions';
import { useDispatch } from 'react-redux';
import secureLocalStorage from 'react-secure-storage';

const getToken = (token = '') => {
  const encryptInit = new SimpleCrypto(import.meta.env.VITE_TOKEN_KEY);
  const encryptedToken = localStorage.getItem(token);
  if (encryptedToken == null) {
    return encryptedToken;
  } else {
    const tokenR = encryptInit.decrypt(encryptedToken);
    return tokenR;
  }
};

const parseJwt = token => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

export function AuthVerify() {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = getToken('token');
    if (token) {
      const decodedJwt = parseJwt(token);
      if (decodedJwt.exp * 1000 < Date.now()) {
        alert('Login Expired. login again..');
        localStorage.removeItem('shortlistarray');
        localStorage.removeItem('page');
        localStorage.removeItem('userstate');
        localStorage.clear();
        secureLocalStorage.clear();
        dispatch(logout());
        window.location.href = '/';
      }
    }
  }, [location]);

  return <div></div>;
}
