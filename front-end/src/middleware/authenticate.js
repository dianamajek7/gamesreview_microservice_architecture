import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { authCheck }  from '../actions/admin'
import { message } from 'antd';
import thunk from 'redux-thunk';
import reducers from '../reducers';
const store = createStore(reducers, applyMiddleware(thunk));

export default (IntialComponent) => {
  const jwtToken = localStorage.getItem('TOKEN');
  class MixedComponent extends Component {


    async checkAuth() {
        if(!this.props.isAuth && !this.props.jwtToken) {
          message.error('Authentication failed, please login!');
          this.props.history.push('/login');
        }
          
        else {
          await authCheck().then(res => {
 
            return res.types.map(obj => store.dispatch({
                type: obj.type,
                isAuthenticated: true,
                payload: {token: jwtToken},
          
              }))
            
          }).catch(err => {
              console.log(err);
              message.error('Authentication failed, please login again!');
              this.props.history.push('/login');
          })
        }
        
    }

    componentDidMount() {
      this.checkAuth();
    }

    componentDidUpdate() {
      this.checkAuth();
    }

    render() {
      return <IntialComponent {...this.props} /> ;
    }
    
  }

  function mapStateToProps(state) {
    return {
      isAuth: state.auth.isAuthenticated,
      jwtToken: state.auth.token
    }
  }

  return connect(mapStateToProps)(MixedComponent);
};
