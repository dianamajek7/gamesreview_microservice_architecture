
import { 
    GET_ALL_USERS_REVIEWS,  
  } from '../actions/types';
  
  const DEFAULT_STATE = {
    allUsersReviews: [],
    methods: []
  }
  
  export default (state = DEFAULT_STATE, action) => {
    switch(action.type) {
      case GET_ALL_USERS_REVIEWS:
        return { ...state, allUsersReviews: action.payload.allReviews, methods: action.payload.methods}
      default:
        return state
    }
  }