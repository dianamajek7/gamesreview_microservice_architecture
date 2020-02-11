import {USER_REVIEW_COMMENTS, GET_ALL_REVIEWCOMMENTS, SAVE_REVIEW_COMMENTS, GET_REVIEW_COMMENTS_NOOFLIKE, 
    DELETE_REVIEW_COMMENT, AUTH_ERROR} from './types';
    const url = `http://localhost:8080`;
//${process.env.PORT || 8080}`;
// const url = `http://localhost:${process.env.PORT || 8080}`;
const getCommentsByUserAndReviewId = (userId, reviewId) => {
    return async dispatch => {
        let isError = false;
        await fetch(`${url}/api/v1.0/comment/getCommentsByUserAndReviewId?userId=${userId}&reviewId=${reviewId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('TOKEN')}`,
        },
        }).then(response => {
            if(response.ok) console.log('recieved user comment') 
            else isError = true
            return response.json()
        }).then(async(data) => {
            if(isError) {
                console.log('err', JSON.stringify(data, null, 2))
                if(data.detail.errors) {
                  const dataErrors = JSON.stringify(data.detail.errors, null, 2).replace(new RegExp('"', 'g'), "")
                  dispatch({type: AUTH_ERROR, payload: dataErrors});
                } else if (data.detail.includes("Could not find user comments on review")) {
                    dispatch({ type: USER_REVIEW_COMMENTS, payload: {getUserReviewComments: 0}});
                }else{
                  const dataError = JSON.stringify(data.detail, null, 2).replace(new RegExp('"', 'g'), "")
                  dispatch({type: AUTH_ERROR, payload: dataError});
                } 
            } else {
                const response = Object.assign({getUserReviewComments: data.message});
                dispatch({ type: USER_REVIEW_COMMENTS, payload: response});
            }
        })
    };
};

export const getUserPhotoAndUsername = (userId) => {
    return new Promise((resolve, reject) => {
        let isError = false;
        fetch(`${url}/api/v1.0/user/getAllUserDataById?Id=${userId}`, {    //authresponse (nginx)
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization':  `${localStorage.getItem('TOKEN')}`,
        },
        }).then(response => {
            if(response.ok) console.log('recieved user profilePhoto')
            else isError = true
            return response.json()
        }).then((data) => {
            if(isError) {
                console.log('err', JSON.stringify(data, null, 2))
                if(data.detail.errors) {
                  const dataErrors = JSON.stringify(data.detail.errors, null, 2).replace(new RegExp('"', 'g'), "");
                  reject(dataErrors);
                }else{                 
                  const dataError = JSON.stringify(data.detail, null, 2).replace(new RegExp('"', 'g'), "");
                  reject(dataError);
                } 
            } else {
                resolve({userProfilePhoto: data.message.profileImageURL, username: data.message.Username});
            }
        })
    });
}
const onLoadReviewCommentsNoOfLikes = (commentId) => {
    return new Promise((resolve, reject) => {
        let isError = false;
        fetch(`${url}/api/v1.0/comment/getAllLikesBycommentID?commentId=${commentId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('TOKEN')}`,
        },
        }).then(response => {
            if(response.ok) console.log('recieved review comments no of likes on load')
            else isError = true
            return response.json()
        }).then(async(data) => {
            if(isError) {
                console.log('err', JSON.stringify(data, null, 2))
                const res = {noOfCommentsLikes: 0}
                resolve(res);
            } else {
                const res = {noOfCommentsLikes: data.message.length}
                resolve(res);
            }
        })
    });
};

const getReviewCommentsNoOfLikes = (commentId) => {
    return async dispatch => {
        let isError = false;
        await fetch(`${url}/api/v1.0/comment/getAllLikesBycommentID?commentId=${commentId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('TOKEN')}`,
        },
        }).then(response => {
            if(response.ok) console.log('recieved noof likes for review comments ')
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
                const res = Object.assign({noOfCommentsLikes: data.message.length})
                dispatch({ type: GET_REVIEW_COMMENTS_NOOFLIKE, payload: res});
            }
        })
    };
};
const getAllReviewComments = (reviewId) => {
    return  async dispatch => {
        let isError = false;
        await fetch(`${url}/api/v1.0/comment/getAllCommentsByReviewID?reviewId=${reviewId}`, {    
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('TOKEN')}`,
          },
        }).then(response => {
            if(response.ok) console.log('recieved game review comments') 
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

                const promises = data.message.map(obj => 
                    getUserPhotoAndUsername(obj.userId).then(res => Object.assign(obj, res))
                );

                Promise.all(promises).then(res => {
                    
                    const noOfLikesPromise = res.map(obj => 
                        onLoadReviewCommentsNoOfLikes(obj.Id).then(res => Object.assign(obj, res))
                    );
                    Promise.all(noOfLikesPromise).then(updatedResult => {
                      const response = Object.assign({allReviewComments: updatedResult})
                      dispatch({ type: GET_ALL_REVIEWCOMMENTS, payload: response});
                    }) 
                })
            }
        })
    }
};

const saveReviewCommentLike = (values) => {
    return  async dispatch => {
        let isError = false;

        await fetch(`${url}/api/v1.0/comment/saveLike`, {    
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('TOKEN')}`,
          },
          body: JSON.stringify(values, null, 2)
        }).then(response => {
            if(response.ok) {
                console.log('successfully saved commet like') 
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
              dispatch({ type: SAVE_REVIEW_COMMENTS, payload: ''});
            }
        })
    }
};

const deleteReviewCommentLike = (commentId, userId) => {
    return  async dispatch => {
        let isError = false;
        await fetch(`${url}/api/v1.0/comment/deleteLike?commentId=${commentId}&userId=${userId}`, {    
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('TOKEN')}`,
          }
        }).then(response => {
            if(response.ok) {
                console.log('successfully deleted review like') 
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
              dispatch({ type: DELETE_REVIEW_COMMENT, payload: ''});
            }
        })
    }
};

export const onLoadGetCommentsByUserAndReviewId = (userId, reviewId) => {
    return new Promise((resolve, reject) =>  {
        let isError = false;
        fetch(`${url}/api/v1.0/comment/getCommentsByUserAndReviewId?userId=${userId}&reviewId=${reviewId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('TOKEN')}`,
        },
        }).then(response => {
            if(response.ok) console.log('recieved user comment') 
            else isError = true
            return response.json()
        }).then(async(data) => {
            if(isError) {
                console.log('err', JSON.stringify(data, null, 2))
            } else {
                const response = Object.assign({getUserReviewComments: data.message});
                resolve(response);
            }
        })
    });
};

const saveReviewComment = (values) => {
    return  async dispatch => {
        let isError = false;

        await fetch(`${url}/api/v1.0/comment/saveComment`, {    
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('TOKEN')}`,
          },
          body: JSON.stringify(values, null, 2)
        }).then(response => {
            if(response.ok) {
                console.log('successfully saved review comment') 
                return response
            } else isError = true
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

                await onLoadGetCommentsByUserAndReviewId(values.userId, values.reviewId).then(userCred => {                 
                    dispatch({ type: USER_REVIEW_COMMENTS, payload: userCred});
                })
            }
        })
    }
};


const updateReviewComment = (values) => {
    return  async dispatch => {
        let isError = false;

        await fetch(`${url}/api/v1.0/comment/updateCommentByUserAndReviewId`, {    
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('TOKEN')}`,
          },
          body: JSON.stringify(values, null, 2)
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
              dispatch({ type: SAVE_REVIEW_COMMENTS, payload: ''});
            }
        })
    }
};

const deleteReviewComment = (reviewId, userId) => {
    return  async dispatch => {
        let isError = false;
        await fetch(`${url}/api/v1.0/comment/deleteComment?reviewId=${reviewId}&userId=${userId}`, {    
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
              dispatch({ type: DELETE_REVIEW_COMMENT, payload: ''});
            }
        })
    }
};

export default { getCommentsByUserAndReviewId, getUserPhotoAndUsername, getAllReviewComments, saveReviewCommentLike,
    getReviewCommentsNoOfLikes, deleteReviewCommentLike, saveReviewComment, updateReviewComment, deleteReviewComment,
    onLoadGetCommentsByUserAndReviewId}