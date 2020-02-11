
import { 
  AUTH_SIGN_UP, 
  AUTH_SIGN_OUT, 
  AUTH_LOGIN, 
  AUTH_ERROR,
  AUTH_CHECK } from '../actions/types';

const DEFAULT_STATE = {
  isAuthenticated: false,
  isAdmin: false,
  token: '',
  authVerification: {},
  errorMessage: '',
}

export default (state = DEFAULT_STATE, action) => {
  switch(action.type) {
    case AUTH_SIGN_UP:
      return { ...state, token: action.payload.token, isAuthenticated: true, isAdmin: false, errorMessage: '' }
    case AUTH_LOGIN:
      return { ...state, token: action.payload.token, isAuthenticated: true, isAdmin: action.isAdmin, errorMessage: '' }
    case AUTH_SIGN_OUT:
      return { ...state, token: action.payload.token, isAuthenticated: false, isAdmin: false, errorMessage: '' }
    case AUTH_CHECK:
      return { ...state, token: action.payload.token, isAuthenticated: action.isAuthenticated, isAdmin: action.isAdmin }
    case AUTH_ERROR:
      return { ...state, errorMessage: action.payload }
    default:
      return state
  }
}