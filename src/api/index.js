import SimpleCrypto from 'simple-crypto-js';

//#export const urlroot = "https://localm-api.dgsbuu.easypanel.host"
//export const url = "https://localm-api.dgsbuu.easypanel.host/api/v1"

//export const urlroot = "http://localhost:5500"
//export const url = "http://localhost:5500/api/v1"

export const urlroot = 'https://marrylocal-api.jl0igu.easypanel.host';
export const url = 'https://marrylocal-api.jl0igu.easypanel.host/api/v1';

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

export const setHeaders = () => {
  const header = {
    headers: {
      // "x-auth-token" : localStorage.getItem('token')
      'x-auth-token': getToken('token'),
    },
  };
  return header;
};
