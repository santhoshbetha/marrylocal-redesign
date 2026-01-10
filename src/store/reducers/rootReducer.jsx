import { combineReducers } from 'redux';
import authReducer from './authReducer';
import { withReduxStateSync } from 'redux-state-sync';

const rootReducer = combineReducers({
  //san here
  //  todos: todoReducer,                   //'todos' becomes 'state' variable (stored in react store), accessed 'state.todos'
  auth: authReducer, //'auth' becomes 'state' variable (stored in react store), accessed 'state.auth'
});

//above is important: it makes 'todos' is the 'store' variable, used all over

//export default rootReducer;
export default withReduxStateSync(rootReducer);
