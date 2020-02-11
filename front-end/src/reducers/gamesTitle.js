import { 
    GET_GAMES_TITLE,  
  } from '../actions/types';
  
  const DEFAULT_STATE = {
    gameTitles: [],
    methods: []
  }
  
  export default (state = DEFAULT_STATE, action) => {
    switch(action.type) {
      case GET_GAMES_TITLE:
        return { ...state, gameTitles: action.payload.titles, methods: action.payload.methods }
      default:
        return state
    }
  }