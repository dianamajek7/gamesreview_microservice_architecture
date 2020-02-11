import games from './games'
import reviews from './reviews'
import admin from './admin';
import {AUTH_SIGN_UP, AUTH_SIGN_OUT, AUTH_LOGIN,
  AUTH_ERROR, DASHBOARD_GET_DATA, GET_GAMES_TITLE} from './types';
const url = `http://localhost:8080`
export const dispatchisAdmin  = () => admin.dispatchisAdmin();
export const getAllGames = () => games.getAllGames();
export const getGamesCategory = () => games.getGamesCategory();
export const getGameByCategory = (categoryName) => games.getGameByCategory(categoryName);
export const getGameByTitle = (gameTitle) => games.getGameByTitle(gameTitle);
export const auth = () => games.auth();
export const authCheck = () => games.authCheck();
export const getGameIDByTitle=(gameTitle) => games.getGameIDByTitle(gameTitle);
export const saveGameReview = (values) => games.saveGameReview(values);
export const saveGameRate = (values) => games.saveGameRate(values);
export const saveGame = (values) => games.saveGame(values);
export const getAllGameReviews = (gameId) => games.getAllGameReviews(gameId) 
export const saveReviewLike = (values) => games.saveReviewLike(values);
export const deleteReviewLike = (reviewId, userId) => games.deleteReviewLike(reviewId, userId)
export const getNoOfLikes = (reviewId) => games.getNoOfLikes(reviewId);
export const getCommentsByUserAndReviewId = (userId, reviewId) => reviews.getCommentsByUserAndReviewId(userId, reviewId);
export const getAllReviewComments = (reviewId) => reviews.getAllReviewComments(reviewId);
export const saveReviewCommentLike = (values) => reviews.saveReviewCommentLike(values);
export const getReviewCommentsNoOfLikes = (commentId) => reviews.getReviewCommentsNoOfLikes(commentId);
export const deleteReviewCommentLike = (commentId, userId) => reviews.deleteReviewCommentLike(commentId, userId);
export const saveReviewComment = (values) => reviews.saveReviewComment(values);
export const onLoadGetCommentsByUserAndReviewId = (userId, reviewId) => reviews.onLoadGetCommentsByUserAndReviewId(userId, reviewId);
export const updateReviewComment = (values) => reviews.updateReviewComment(values);
export const deleteReviewComment =(reviewId, userId) => reviews.deleteReviewComment(reviewId, userId);
export const getAllUsersReviews = () => admin.getAllUsersReviews();
export const updateReviewFlag = (reviewId) => admin.updateReviewFlag(reviewId);
export const deleteReviewFlag = (reviewId) => admin.deleteReviewFlag(reviewId);

export const login = (values) => {
  return  async dispatch => {
      let isError = false;
      await fetch(`${url}/api/v1.0/user/login`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values, null, 2)
      }).then(response => {
        if(response.ok) console.log('login OK')
        else isError = true
        return response.json()
      }).then(data => {
          if(isError) {
              console.log('err', JSON.stringify(data, null, 2))
              if(data.detail.errors) {
                const dataErrors = JSON.stringify(data.detail.errors, null, 2).replace(new RegExp('"', 'g'), "")
                dispatch({type: AUTH_ERROR, payload: dataErrors});
              }else{
                const dataError = JSON.stringify(data.detail, null, 2).replace(new RegExp('"', 'g'), "")
                dispatch({type: AUTH_ERROR, payload: dataError});
              } 
          } else {
            if(values.username.includes("admin"))
              dispatch({ type: AUTH_LOGIN, payload: data, isAdmin: true});
            else 
              dispatch({ type: AUTH_LOGIN, payload: data, isAdmin: false});
            localStorage.setItem('TOKEN', data.token); 
          }
      })
  }
}

export const signup = (values) => {
  return async dispatch => {
      let isError = false;
      console.log('Received values from signup form');
      await fetch(`${url}/api/v1.0/user/signup`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values, null, 2)
      }).then(response => {
          if(response.ok) console.log('signup OK')
          else isError = true
          return response.json()
      }).then(data => {
        if(isError) {
          console.log('err', JSON.stringify(data, null, 2))
          if(data.detail.errors) {
            const dataErrors = JSON.stringify(data.detail.errors, null, 2).replace(new RegExp('"', 'g'), "")
            dispatch({type: AUTH_ERROR, payload: dataErrors});
          }
          else{
            const dataError = JSON.stringify(data.detail, null, 2).replace(new RegExp('"', 'g'), "")
            dispatch({type: AUTH_ERROR, payload: dataError});
          } 
        } else {
          dispatch({ type: AUTH_SIGN_UP, payload: data.message, isAdmin: false});
        }
      })
  }
}

export const signOut = () => {
  return async dispatch => {
    let isError = false;

    await fetch(`${url}/api/v1.0/user/logout`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('TOKEN')}`,
      },
    }).then(response => {
        if(response.ok) console.log('successfully logged user out')
        else isError = true
        return response.json()
    }).then(data => {
        if(isError) {
          const dataErrors = JSON.stringify(data.detail, null, 2).replace(new RegExp('"', 'g'), "")
          dispatch({type: AUTH_ERROR, payload: dataErrors});
        } else {
          localStorage.removeItem('TOKEN');
          dispatch({ type: AUTH_SIGN_OUT, payload: data.message});
        }
    })
  
  };
};

export const getUserData = () => {
  return async dispatch => {
    let isError = false;
    let userID = await auth();
    await fetch(`${url}/api/v1.0/user/getAllUserDataById?Id=${userID}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `${localStorage.getItem('TOKEN')}`,
      },
    }).then(response => {
        if(response.ok) console.log('recieved user dashboard data')
        else isError = true
        return response.json()
    }).then(data => {
        if(isError) {
          console.log('err', JSON.stringify(data, null, 2))
          if(data.detail.errors) {
            const dataErrors = JSON.stringify(data.detail.errors, null, 2).replace(new RegExp('"', 'g'), "")
            dispatch({type: AUTH_ERROR, payload: dataErrors});
          }else{
            const dataError = JSON.stringify(data.detail, null, 2).replace(new RegExp('"', 'g'), "")
            dispatch({type: AUTH_ERROR, payload: dataError});
          } 
        } else {
          dispatch({ type: DASHBOARD_GET_DATA, payload: data.message});
        }
    })
  };
}

export const getGameTitles = () => {
  return async dispatch => {
    let isError = false;
    dispatch({ type: DASHBOARD_GET_DATA, payload: ""});
    await fetch(`${url}/api/v1.0/game/getgameTitles`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `${localStorage.getItem('TOKEN')}`,
      },
    }).then(response => {
        if(response.ok) console.log('recieved user dashboard data')
        else isError = true
        return response.json()
    }).then(async(data) => {
        if(isError) {
          dispatch({type: AUTH_ERROR, payload: ''});
        } else {
          const res = Object.assign({titles: data.message})        
          dispatch({ type: GET_GAMES_TITLE, payload: res});
        }
    })
  };
}

export const clearErrors = () => {
  return async dispatch => { 
    dispatch({ type: AUTH_ERROR, payload: ''});
  }
}
