import { 
    GET_GAMESCATEGORY,  
  } from '../actions/types';
  
  const DEFAULT_STATE = {
    categories: [],
    methods: []
  }
  
  export default (state = DEFAULT_STATE, action) => {
    switch(action.type) {
      case GET_GAMESCATEGORY:
        return { ...state, categories: action.payload.gamesCategory, methods: action.payload.methods}
      default:
        return state
    }
  }