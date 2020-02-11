/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'antd/dist/antd.css';
import './Dashboard.css';
import {Avatar, Icon, Button, Input, AutoComplete, 
  Drawer, List, Col, Row} from 'antd';
import * as actions from '../../actions';

const { Option } = AutoComplete;

const searchResult = (titles) => {
  return titles.map(obj => obj.Title);
}

const pStyle = {
  fontSize: 16,
  color: 'rgba(0,0,0,0.85)',
  lineHeight: '24px',
  display: 'block',
  marginBottom: 16,
};

const DescriptionItem = ({ title, content }) => (
  <div
    style={{
      fontSize: 14,
      lineHeight: '22px',
      marginBottom: 7,
      color: 'rgba(0,0,0,0.65)',
    }}
  >
    <p
      style={{
        marginRight: 8,
        display: 'inline-block',
        color: 'rgba(0,0,0,0.85)',
      }}
    >
      {title}:
    </p>
    {content}
  </div>
);

const renderOption = (item) => {
  return (
    <Option key={item} text={item} >
          <div className="global-search-item">
            <span className="global-search-item-desc">
            {item.query}
              {item} 
            </span>
          </div>

      </Option>
    
  );
}
class Dashboard extends Component {
  async componentDidMount() {
    this.props.clearErrors();
    this.props.getUserData();
    this.props.getGameTitles()
  }

  constructor(props){
    super(props);

    this.handleSearch = this.handleSearch.bind(this);
    this.showDrawer = this.showDrawer.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.state = {
      gameTitleDataSource: [],
      visible: false,
    };
    
  }

  handleSearch = async(value) => {
    const updatedList = await this.onFilter(value)
    this.setState({
      gameTitleDataSource: value ? updatedList : searchResult(this.props.gameTitles),
    });
  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  onFilter = (inputValue) => {
    return searchResult(this.props.gameTitles).filter(obj => obj.toString().toLowerCase().includes(
      inputValue.toLowerCase())
        );
  }

  onSelect = (value) => {
    if (!this.props.errorMessage ) {
      this.props.history.push(`/viewGames?title=${value}`);
    }
  }
  
  render() {
    const { gameTitleDataSource } = this.state;
    return (
      <div>
        <h1 id="header" tagname="header">Welcome to Game Review</h1>
        <h2>Search a game by its title to get started</h2>
        <div id="searchText" className="label" style={{display: 'flex', justifyContent: 'center', position: 'relative',
          top: '130px'}}>

                <div className="global-search-wrapper" style={{ width: 500}}>
                    <AutoComplete 
                      id="autoComplete"
                      className="global-search"
                      size="large"
                      style={{width:'100%'}}
                      dataSource={gameTitleDataSource.map(renderOption)}
                      onSelect={this.onSelect}
                      onSearch={this.handleSearch}
                      placeholder="search game by title"
                      optionLabelProp="text"
                    >
                      <Input
                        id="searchInput"
                        suffix={
                          <Button
                            className="search-btn"
                            style={{ marginRight: -12 }}
                            size="large"
                            type="primary"
                          >
                            <Icon type="search" />
                          </Button>
                        }
                      />
                    </AutoComplete>
                </div>

          </div>
          <div >
            <List id="gameTitleList" style={{display: 'flex', justifyContent: 'center', position: 'relative',
           bottom: '110px', left:'80%', width: '300px'}}
              dataSource={[{ name: this.props.user} ]}
              bordered
              renderItem={item => (
                <List.Item
                  key={item.id}
                  actions={[
                    <a style={{cursor: 'auto', 'textDecoration': 'underline'}}onClick={this.showDrawer} key={`a-${item.id}`}>    
                      {(<span style={{ color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.3)', cursor: 'auto' }}>
                        View Profile
                    </span>
                )}
                    </a>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar size={50}
                      src={this.props.profilePhoto}/>
                    }
                    title={(<span style={{ color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.3)', cursor: 'auto' }}>
                              {item.name}
                          </span>)}
                    description={(<span style={{ color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.3)', cursor: 'auto' }}>
                                    Game Reviewer
                                </span>)}
                  />
                </List.Item>
              )}
            />
            <Drawer
              id="userDrawer"
              width={500}
              placement="right"
              closable={false}
              onClose={this.onClose}
              visible={this.state.visible}
            >
              <p style={{ ...pStyle, marginBottom: 24 }}>User Profile</p>
              <p style={pStyle}>Personal</p>
              <Row>
                <Col span={12}>
                  <DescriptionItem title="Full Name" content={this.props.user}/>
                </Col>
                <Col span={12}>
                  <DescriptionItem title="Email" content={this.props.email} />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <DescriptionItem
                    title="About"
                    content={this.props.about ? this.props.about : ''}
                  />
                </Col>
              </Row>
            </Drawer>
          </div>
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userId: state.dash.userId,
    user: state.dash.user,
    about: state.dash.about,
    email: state.dash.email,
    profilePhoto: state.dash.profilePhoto,
    gameTitles: state.gamesTitle.gameTitles,
    errorMessage: state.auth.errorMessage,

    dashboard: state.dash,
    gamesTitle: state.gamesTitle,
    auth: state.auth
  }
}

export default connect(mapStateToProps, actions)(Dashboard);
