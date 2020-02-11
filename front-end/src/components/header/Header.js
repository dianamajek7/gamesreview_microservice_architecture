import React, { Component } from 'react';
import { Menu, Icon, Layout} from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../actions';


class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: 'dark',
    };
    this.signOut = this.signOut.bind(this);
  }

  signOut() {
    this.props.signOut();
  }

  render() {
    return (
      <Layout className="header">
        <Menu theme={this.state.theme}
          activeKey={this.props.currentPath}
          mode="horizontal"
          selectedKeys={this.props.currentPath }
          style={{height: "100%", borderRight: 0,  'letterSpacing':'1px', textAlign:'center'}}
        >
          { !this.props.isAuth ? 
            <Menu.Item key="/">
                <Link to={"/"} className="nav-text"> 
                  <Icon type='home' />
                  Login</Link>
            </Menu.Item> : null }

          { this.props.isAuth && this.props.jwtToken && !this.props.isAdminLogged?
            <Menu.Item key="/dashboard">
                <Link to="/dashboard" className="nav-text">Dashboard</Link>
            </Menu.Item> : null }

            { this.props.isAuth && this.props.jwtToken  && this.props.isAdminLogged ?
            <Menu.Item key="/adminPortal">
                <Link to="/adminPortal" className="nav-text">Admin</Link>
            </Menu.Item> : null }
          
            { this.props.isAuth && this.props.jwtToken  && !this.props.isAdminLogged?
            <Menu.Item key="/viewAllGames">
                <Link to="/viewAllGames" className="nav-text">Games</Link>
            </Menu.Item> : null }
          
          { !this.props.isAuth && !this.jwtToken  && !this.props.isAdminLogged?
            <Menu.Item key="/signup">
              <Link to="/signup" className="nav-text">Sign Up</Link>
            </Menu.Item> : null } 

          { this.props.isAuth && this.props.jwtToken ?
            <Menu.Item key="/signout">
              <Link to="/login" onClick={this.signOut} className="nav-text">
                  <Icon type='logout'/>
                Sign Out</Link>
            </Menu.Item> : null }
  
              </Menu>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    isAdminLogged: state.auth.isAdmin,
    isAuth: state.auth.isAuthenticated,
    jwtToken: state.auth.token
  };
}

export default connect(mapStateToProps, actions)(Header);