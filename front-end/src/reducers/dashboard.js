import { 
    DASHBOARD_GET_DATA,  
  } from '../actions/types';
  
  const DEFAULT_STATE = {
    userId: 0,
    user: '',
    about: '',
    email: '',
    profilePhoto: '',
    methods: []
  }
  
  export default (state = DEFAULT_STATE, action) => {
    switch(action.type) {
      case DASHBOARD_GET_DATA:
        return { ...state, userId: action.payload.Id, user: action.payload.Username, 
          about: action.payload.About, email: action.payload.Email, profilePhoto: action.payload.profileImageURL, 
          methods: action.payload.methods }
      default:
        return state
    }
  }