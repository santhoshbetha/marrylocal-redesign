import { toast } from 'sonner';
import SimpleCrypto from 'simple-crypto-js';

const saveToken = (token = '') => {
  const encryptInit = new SimpleCrypto(import.meta.env.VITE_TOKEN_KEY);
  const encryptedToken = encryptInit.encrypt(token);

  localStorage.setItem('token', encryptedToken);
};

export const registerSuccess = tokendata => {
  return async dispatch => {
    saveToken(tokendata?.access_token);
    dispatch({
      type: 'REGISTER_SUCCESS',
      token: tokendata?.access_token,
    });
  };
};

export const registerFailure = error => {
  return async dispatch => {
    dispatch({
      type: 'REGISTER_FAILURE',
      payload: String(error),
    });
    toast.error(String(error), {
      position: 'top-center',
    });
  };
};

export const loginSuccess = tokendata => {
  return async dispatch => {
    saveToken(tokendata?.access_token); //saves token to local storage
    dispatch({
      type: 'LOGIN_SUCCESS',
      token: tokendata?.access_token,
    });
  };
};

export const loginFailure = error => {
  return async dispatch => {
    dispatch({
      type: 'LOGIN_FAILURE',
      payload: String(error),
    });
    toast.error(String(error), {
      position: 'bottom-right',
    });
  };
};

export const loadUser = () => {
  return (dispatch, getState) => {
    const token = getState().auth?.token;
    if (token) {
      dispatch({
        type: 'USER_LOADED',
        token,
      });
    } else {
      return null;
    }
  };
};

export const logout = () => {
  return dispatch => {
    //TODO - clear the requires (state variables)
    dispatch({
      type: 'LOGOUT',
    });
  };
};

export const clearstate = () => {
  return dispatch => {
    //clear the requires (state variables)
    dispatch({
      type: 'CLEARSTATE',
    });
  };
};
