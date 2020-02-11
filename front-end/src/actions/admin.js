import {AUTH_CHECK, GET_ALL_USERS_REVIEWS, AUTH_ERROR, AUTH_SIGN_UP, AUTH_LOGIN, UPDATE_REVIEW_FLAG, DELETE_REVIEW_FLAG} from './types';
import { getUserPhotoAndUsername } from './reviews';
const url = `http://localhost:8080`;
// ${process.env.API_PORT || 3031}`

export const dispatchisAdmin = () => {
  return async dispatch => { 
    dispatch({ type: AUTH_CHECK, payload: {token: localStorage.getItem('TOKEN')}, isAuthenticated: true, isAdmin: true});
  }
}
export const authCheck = () => {
    return new Promise((resolve, reject) => {
        let isError = false;
        fetch(`${url}/authresponse`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization':  `${localStorage.getItem('TOKEN')}`,
        },
        }).then(response => {
            if(response.ok) console.log('recieved auth reponse with userID and name')
            else isError = true
            return response.json()
        }).then(async(data) => {
            if(isError) {
                console.log('err', JSON.stringify(data, null, 2))
                const dataError = JSON.stringify(data.detail, null, 2).replace(new RegExp('"', 'g'), "")
                if(dataError.includes('Token malformed, Authentication Failed') 
                    || dataError.includes('Token no longer valid, Authentication Failed')) 
                {
                  if(localStorage.getItem('TOKEN'))
                    localStorage.removeItem('TOKEN');
                  reject({type: AUTH_ERROR, payload: dataError});
                } 
            } 
            else {
                const jwtPayload = data.jwtPayload                
                return resolve({types: [{type:AUTH_LOGIN}, {type:AUTH_SIGN_UP}, {type:AUTH_CHECK}], jwtPayload});
            }
        })
    });
};

const getAllUsersReviews = () => {
    return async dispatch => {
        let isError = false;
        await fetch(`${url}/api/v1.0/review/admin/getAllReviews`, {    
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('TOKEN')}`,
          },
        }).then(response => {
            if(response.ok) console.log('admin call recieved all reviews') 
            else isError = true
            return response.json()
        }).then(async(data) => {
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
                const result = data.message.map(obj => {
                    const Id = obj.Id ; const userId= obj.userId; const Title = obj.Title
                    const content = obj.content; const flag = obj.flag
                    const newObj = {Id, userId, Title, content, flag}
                          return newObj})

                const promises = result.map(obj => 
                    getUserPhotoAndUsername(obj.userId).then(res => Object.assign(obj, {username:res.username}))
                );

                Promise.all(promises).then(res => {                 
                    const response = Object.assign({allReviews: res})
                    dispatch({ type: GET_ALL_USERS_REVIEWS, payload: response});
                })
            }
        })
    }
};

const updateReviewFlag = (reviewId) => {
  return  async dispatch => {
      let isError = false;
      console.log('Update called');
      await fetch(`${url}/api/v1.0/review/admin/updateReviewFlag/${reviewId}`, {    
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('TOKEN')}`,
        },
        body: JSON.stringify({flag: "approved"}, null, 2)
      }).then(response => {
          if(response.ok) {
              console.log('successfully updated review comment') 
              return response
          } else isError = true
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
            dispatch({ type: UPDATE_REVIEW_FLAG, payload: ''});
          }
      })
  }
};

const deleteReviewFlag = (reviewId) => {
  return  async dispatch => {
      let isError = false;
      await fetch(`${url}/api/v1.0/review/admin/deleteReview/${reviewId}`, {    
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('TOKEN')}`,
        }
      }).then(response => {
          if(response.ok) {
              console.log('successfully deleted review comment') 
              return response
          } else isError = true
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
            dispatch({ type: DELETE_REVIEW_FLAG, payload: ''});
          }
      })
  }
};


export default { dispatchisAdmin, authCheck, getAllUsersReviews, updateReviewFlag, deleteReviewFlag }