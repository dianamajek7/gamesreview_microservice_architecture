import {GET_GAMES, GET_GAMESCATEGORY, AUTH_ERROR, SAVE_REVIEW, 
  REVIEWS_NOOFLIKES, GAME_REVIEWS} from './types';
  const url = `http://localhost:8080`


const getGamesCategory = () => {
    return async dispatch => {
        let isError = false;
        await fetch(`${url}/api/v1.0/game/getAllCategories`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('TOKEN')}`,
        },
        }).then(response => {
            if(response.ok) console.log('recieved all games categories')
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
                const res = Object.assign({gamesCategory: data.message})
                dispatch({ type: GET_GAMESCATEGORY, payload: res});
            }
        })
    };
};

const getAllGames = () => {
    return async dispatch => {
        let isError = false;
        await fetch(`${url}/api/v1.0/game/getAllgames`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('TOKEN')}`,
        },
        }).then(response => {
            if(response.ok) console.log('recieved all games')
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
                const res = Object.assign({games: data.message})
                dispatch({ type: GET_GAMES, payload: res});
            }
        })
    };
};

const getGameByCategory = (categoryName) => {
    return async dispatch => {
        let isError = false;
        await fetch(`${url}/api/v1.0/game/getgameByCategory?categoryName=${categoryName}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('TOKEN')}`,
        },
        }).then(response => {
            if(response.ok) console.log('recieved filtered games by category name')
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
                const res = Object.assign({games: data.message})
                dispatch({ type: GET_GAMES, payload: res});
            }
        })
    };
};

const getGameByTitle = (gameTitle) => {
    return async dispatch => {
        let isError = false;
        await fetch(`${url}/api/v1.0/game/getgameByTitle?gameTitle=${gameTitle}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('TOKEN')}`,
        },
        }).then(response => {
            if(response.ok) console.log('recieved filtered games by category name')
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
                const res = Object.assign({games: data.message})
                dispatch({ type: GET_GAMES, payload: res});
            }
        })
    };
};

const auth = () => {
    return  new Promise((resolve, reject) => {
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
        }).then((data) => {
            if(isError) {
                console.log('err', JSON.stringify(data, null, 2))
                if(data.detail.errors) {
                  const dataErrors = JSON.stringify(data.detail.errors, null, 2).replace(new RegExp('"', 'g'), "")
                  reject(dataErrors);
                }else{
                    
                  const dataError = JSON.stringify(data.detail, null, 2).replace(new RegExp('"', 'g'), "")
                  reject(dataError);
                } 
            } else {
                resolve(data.jwtPayload.id);
            }
        })
    });
};

const getGameIDByTitle = (gameTitle) => {
    return new Promise((resolve, reject) => {
        let isError = false;
        fetch(`${url}/api/v1.0/game/getgameId?gameTitle=${gameTitle}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('TOKEN')}`,
        },
        }).then(response => {
            if(response.ok) console.log('recieved gameID by game title') 
            else isError = true
            return response.json()
        }).then(async(data) => {
            if(isError) {
                console.log('err', JSON.stringify(data, null, 2))
                if(data.detail.errors) {
                  const dataErrors = JSON.stringify(data.detail.errors, null, 2).replace(new RegExp('"', 'g'), "")
                  reject({type: AUTH_ERROR, payload: dataErrors});
                }else{
                  const dataError = JSON.stringify(data.detail, null, 2).replace(new RegExp('"', 'g'), "")
                  reject({type: AUTH_ERROR, payload: dataError});
                } 
            } else {
                resolve(data.message);
            }
        })
    });
};

const saveGameReview = (values) => {
    return  async dispatch => {
        let isError = false;
        const userID = await auth();
        const gameID = await getGameIDByTitle(values.gameTitleSelected);
        const concatData = {title: values.title, userId: userID,
            content: values.content, screenshot: values.screenshot, gameId: gameID}
        await fetch(`${url}/api/v1.0/review/saveReview`, {    
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('TOKEN')}`,
          },
          body: JSON.stringify(concatData, null, 2)
        }).then(response => {
            if(response.ok) {
                console.log('successfully saved review') 
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
              dispatch({ type: SAVE_REVIEW, payload: ''});
            }
        })
    }
};


const saveGameRate = (values) => {
    return  async dispatch => {
        let isError = false;
        const userID = await auth();
        const concatData = {title: values.title,  rate: values.rate, userId: userID}
        await fetch(`${url}/api/v1.0/game/saveRate`, {    
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('TOKEN')}`,
          },
          body: JSON.stringify(concatData, null, 2)
        }).then(response => {
            if(response.ok) {
                console.log('successfully saved rate') 
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
              dispatch({ type: SAVE_REVIEW, payload: ''});
            }
        })
    }
}

const saveGame = (values) => {
    return  async dispatch => {
        let isError = false;

        await fetch(`${url}/api/v1.0/game/savegame`, {    
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('TOKEN')}`,
          },
          body: JSON.stringify(values, null, 2)
        }).then(response => {
            if(response.ok) {
                console.log('successfully saved game') 
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
              dispatch({ type: GET_GAMES, payload: ''});
            }
        })
    }
};

export const getUserProfilePhoto = (userId) => {
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
                resolve({userProfilePhoto: data.message.profileImageURL});
            }
        })
    });
  }

const getAllGameReviews = (gameId) => {
    return  async dispatch => {
        let isError = false;
        await fetch(`${url}/api/v1.0/review/getAllReviewsByGameId?gameId=${gameId}`, {    
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('TOKEN')}`,
          },
        }).then(response => {
            if(response.ok) console.log('recieved game reviews') 
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
                  getUserProfilePhoto(obj.userId).then(res => Object.assign(obj, res))
                );

                Promise.all(promises).then(res => {
                    
                    const noOfLikesPromise = res.map(obj => 
                      onLoadNoOfLikes(obj.Id).then(res => Object.assign(obj, res))
                    );
                    Promise.all(noOfLikesPromise).then(updatedResult => {
                      const response = Object.assign({gameReviews: updatedResult})
                      dispatch({ type: GAME_REVIEWS, payload: response});
                    }) 
                })
            }
        })
    }
};

const saveReviewLike = (values) => {
    return  async dispatch => {
        let isError = false;
        await fetch(`${url}/api/v1.0/review/saveLike`, {    
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('TOKEN')}`,
          },
          body: JSON.stringify(values, null, 2)
        }).then(response => {
            if(response.ok) {
                console.log('successfully saved review like') 
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
              dispatch({ type: GAME_REVIEWS, payload: ''});
            }
        })
    }
};

const deleteReviewLike = (reviewId, userId) => {
    return  async dispatch => {
        let isError = false;
        await fetch(`${url}/api/v1.0/review/deleteLike?reviewId=${reviewId}&userId=${userId}`, {    
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('TOKEN')}`,
          }
        }).then(response => {
            if(response.ok) {
                console.log('successfully saved review like') 
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
              dispatch({ type: GAME_REVIEWS, payload: ''});
            }
        })
    }
};
const onLoadNoOfLikes = (reviewId) => {
  return new Promise((resolve, reject) => {
      let isError = false;
      fetch(`${url}/api/v1.0/review/getAllLikesByReviewId?reviewId=${reviewId}`, {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('TOKEN')}`,
      },
      }).then(response => {
          if(response.ok) console.log('recieved review no of likes')
          else isError = true
          return response.json()
      }).then(async(data) => {
          if(isError) {
              console.log('err', JSON.stringify(data, null, 2))
              resolve(0);
          } else {
              const res = {noOfreviewLikes: data.message.length}
              resolve(res);
          }
      })
  });
};
const getNoOfLikes = (reviewId) => {
  return async dispatch => {
      let isError = false;
      await fetch(`${url}/api/v1.0/review/getAllLikesByReviewId?reviewId=${reviewId}`, {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('TOKEN')}`,
      },
      }).then(response => {
          if(response.ok) console.log('recieved filtered games by category name')
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
              const res = Object.assign({noOfreviewLikes: data.message.length})
              dispatch({ type: REVIEWS_NOOFLIKES, payload: res});
          }
      })
  };
};

export default {getAllGames, getGamesCategory, getGameByCategory, getGameByTitle, 
    auth, getGameIDByTitle, saveGameRate, saveGameReview, saveGame, getAllGameReviews,
    saveReviewLike, deleteReviewLike, getNoOfLikes};