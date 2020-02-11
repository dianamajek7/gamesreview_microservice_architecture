import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './auth';
import dashboardReducer from './dashboard';
import gamesReducer from './games';
import gamesCategoryReducer from './gamesCategory';
import gamesTitleReducer from './gamesTitle';
import reviewsReducer from './reviews'
import adminReducer from './admin';

export default combineReducers({
  form: formReducer,
  auth: authReducer,
  dash: dashboardReducer,
  games: gamesReducer,
  gamesCategory: gamesCategoryReducer,
  reviews: reviewsReducer,
  gamesTitle: gamesTitleReducer,
  admin: adminReducer,
});
