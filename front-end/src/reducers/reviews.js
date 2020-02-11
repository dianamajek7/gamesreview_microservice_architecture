import { 
    GAME_REVIEWS, REVIEWS_NOOFLIKES, USER_REVIEW_COMMENTS, GET_ALL_REVIEWCOMMENTS, GET_REVIEW_COMMENTS_NOOFLIKE
  } from '../actions/types';
  
  const DEFAULT_STATE = {
    userPhoto: '',
    allgameReviews: [],
    likes: 0,
    commentLikes: 0,
    getUserComment: [],
    getAllReviewComments: [],
    methods: []
  }
  
  export default (state = DEFAULT_STATE, action) => {
    switch(action.type) {
      case GAME_REVIEWS:
        return { ...state, allgameReviews: action.payload.gameReviews, 
                methods: action.payload.methods}
      case REVIEWS_NOOFLIKES:
            return { ...state, likes: action.payload.noOfreviewLikes, methods: action.payload.methods}
      case USER_REVIEW_COMMENTS:
          return { ...state, getUserComment: action.payload.getUserReviewComments, methods: action.payload.methods}
      case GET_ALL_REVIEWCOMMENTS:
          return { ...state, getAllReviewComments: action.payload.allReviewComments, methods: action.payload.methods}
      case GET_REVIEW_COMMENTS_NOOFLIKE:
          return { ...state, commentLikes: action.payload.noOfCommentsLikes, methods: action.payload.methods}
      default:
        return state
    }
  }