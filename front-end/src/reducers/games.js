import { 
    GET_GAMES,  
  } from '../actions/types';
  
  const DEFAULT_STATE = {
    allGames: [],
    methods: []
  }
  
  export default (state = DEFAULT_STATE, action) => {
    switch(action.type) {
      case GET_GAMES:
        return { ...state, allGames: action.payload.games, methods: action.payload.methods}
      default:
        return state
    }
  }