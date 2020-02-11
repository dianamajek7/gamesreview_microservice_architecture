import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import SignUp from './components/signup/SignupForm';
import Login from './components/login/LoginForm';
import Dashboard from './components/dashboard/Dashboard';
import Games from './components/games/Games';
import reducers from './reducers';
import authenticate from './middleware/authenticate';
import GameReviews from './components/reviews/GameReviews';
import ReviewComments from './components/comments/Comments'
import Admin from './components/admin/Admin';

const jwtToken = localStorage.getItem('TOKEN');
ReactDOM.render(
    <Provider store={createStore(reducers, {
        auth: {
          token: jwtToken,
          isAuthenticated: jwtToken  ? true : false,
        }
      }, applyMiddleware(reduxThunk))}>
    <Router>
       <App>
         <Switch>
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/adminPortal" component={authenticate(Admin)} />
          <Route exact path="/dashboard" component={authenticate(Dashboard)} />
          <Route exact path="/viewGames" component={authenticate(Games)} />
          <Route exact path="/viewAllGames" component={authenticate(Games)} />
          <Route exact path="/gameReviews" component={authenticate(GameReviews)} />
          <Route exact path="/reviewComments" component={authenticate(ReviewComments)} />
          <Route exact path="*" component={Login}/> 
        </Switch>
        </App>
    </Router>
   </Provider>, 
   document.getElementById('root'));

serviceWorker.unregister();
