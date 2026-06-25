import {combineReducers} from 'redux';
import types from '../types';
import auth from './auth';

const appReducer = combineReducers({
  auth,
});

const rootReducer = (state: any, action: any) => {
  // console.log(action.type, "action.type")
  if (action.type == types.CLEAR_REDUX_STATE) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
