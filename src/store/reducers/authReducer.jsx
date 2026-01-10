import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';
import SimpleCrypto from 'simple-crypto-js';

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

const initialState = {
  // token: localStorage.getItem('token'),
  token: getToken('token'),
  firstname: null,
  email: null,
  _id: null,
  error: null,
  role: '',
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      // toast("User loaded", {
      //     position: 'top-right',
      //   });
      const userU = jwtDecode(action.token);
      return {
        //new state return // will be accessed like this: state.auth.name/state.email..
        ...state, //state.auth -> auth because "auth: authReducer" (makes auth reside inside 'state')
        token: action.token, //this returned object goes and updates 'state.auth' variable
        firstname: userU.firstname,
        email: userU.email,
        _id: userU._id,
      };
    case 'REGISTER_SUCCESS':
      toast('You are registered succesfully...', {
        position: 'top-right',
      });
      if (action.token != null) {
        const userR = jwtDecode(action.token);
        return {
          //new state return // will be accessed like this: state.auth.name/state.email..
          ...state, //state.auth -> auth because "auth: authReducer" (makes auth reside inside 'state')
          token: action.token, //this returned object goes and updates 'state.auth' variable
          firstname: userR.user_metadata.firstname,
          email: userR.email,
          //role: userR.role //(authenticated)
        };
      } else {
        return {
          ...state,
          token: null,
          firstname: 'invalid',
          email: 'invalid',
          role: 'authenticated',
          //role: userR.role //(authenticated)
        };
      }

    case 'REGISTER_FAILURE':
      toast.error(action.error, {
        position: 'top-right',
      });
      return {
        //new state return // will be accessed like this: state.auth.name/state.email..
        ...state, //state.auth -> auth because "auth: authReducer" (makes auth reside inside 'state')
        token: null, //this returned object goes and updates 'state.auth' variable
        firstname: 'invalid',
        email: 'invalid',
        _id: null,
        error: action.payload,
      };
    case 'LOGIN_SUCCESS':
      toast('Login Successful...', {
        position: 'top-right',
        cancel: {
          label: 'X',
          onClick: () => console.log('Close!'),
        },
      });
      const userL = jwtDecode(action.token);
      return {
        //new state return // will be accessed like this: state.auth.name/state.email..
        ...state, //state.auth -> auth because "auth: authReducer" (makes auth reside inside 'state')
        token: action.token, //this returned object goes and updates 'state.auth' variable
        firstname: userL.user_metadata.firstname,
        email: userL.email,
      };

    case 'LOGIN_FAILURE':
      toast.error('Login Failed...try again later', {
        position: 'top-right',
      });
      return {
        //new state return // will be accessed like this: state.auth.name/state.email..
        ...state, //state.auth -> auth because "auth: authReducer" (makes auth reside inside 'state')
        token: null, //this returned object goes and updates 'state.auth' variable
        firstname: 'invalid',
        email: 'invalid',
        _id: null,
        error: action.payload,
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('alink');
      toast('Logged Out...', {
        position: 'bottom-right',
      });
      return {
        // //new state return
        token: null,
        firstname: null,
        email: null,
        _id: null,
      };
    case 'CLEARSTATE':
      return {
        // //new state return
        token: null,
        firstname: null,
        email: null,
        _id: null,
      };

    default:
      return state;
  }
};

export default authReducer;
