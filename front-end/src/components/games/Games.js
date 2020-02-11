/* eslint-disable eqeqeq */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ReviewCreateForm } from '../reviews/Review'
import { AddGameCreateForm } from './AddGame'
import { List, Icon, Menu, Dropdown, message} from 'antd';
import * as actions from '../../actions';

class Games extends Component {
  async componentDidMount() {
    
    const param = this.props.location.search;
      if(this.props.location.search.includes('?title=')) {  
        this.props.clearErrors();
        const paramTitle = param.split('=')[1]
        this.props.getGameByTitle(paramTitle);
        this.setState({allgamesVisible: false, initLoading: false})
      } else {
        this.props.clearErrors();
        this.props.getAllGames();
        this.props.getGamesCategory();
        this.setState({allgamesVisible: true, initLoading: false})
      }
  }

  async success(action) {
    message
      .loading('Action in progress..', 1.5)
      .then(() => message.success(`Successfully ${action}`, 2.5))
  };
  

  constructor(props){
    super(props);

    this.onClick = this.onClick.bind(this);
    this.showReviewModal = this.showReviewModal.bind(this);
    this.handleReviewCancel = this.handleReviewCancel.bind(this);
    this.handleReviewCreate = this.handleReviewCreate.bind(this);
    this.saveReviewFormRef = this.saveReviewFormRef.bind(this);
    this.onReviewIconClick = this.onReviewIconClick.bind(this);
    this.showAddGameDrawer = this.showAddGameDrawer.bind(this)
    this.handleAddGameOnClose = this.handleAddGameOnClose.bind(this)
    this.handleAddGameCreate = this.handleAddGameCreate.bind(this)
    this.saveAddGameFormRef = this.saveAddGameFormRef.bind(this)

    this.state = {
      items: [],
      allgamesVisible: true,
      reviewFormVisible: false,
      gameTitle: '',
      addGameFormVisible: false,
      initLoading: true,
    };
  }
  
  onClick = ({ key }) => {
    const obj = this.props.gamesCategories.find((item) => item.Id == key)
    message.info(`Filtered by ${obj.Name}`)
    this.props.getGameByCategory(obj.Name)
  };


  onReviewIconClick = (title) => {
    this.setState({ gameTitle: title });
  };

  showReviewModal = () => {
    this.setState({ reviewFormVisible: true});
  };

  handleReviewCancel = () => {
    this.setState({ reviewFormVisible: false });
  };

  handleReviewCreate = async() => {
    const { form } = this.formRef.props;
    form.validateFields(async(err, values) => {
      if (err) {
        return;
      }
      
      const result = {}
      result.gameTitleSelected = this.state.gameTitle
      
      Object.assign(values, result)
      this.props.saveGameReview(values);
      if(!this.props.errorMessage)
          this.props.saveGameRate(values);
      else if (this.props.errorMessage){
        message.error(`${this.props.errorMessage}`);
        this.props.clearErrors();
        return;
      }
      if (!this.props.errorMessage) {
        await this.success('saved review')
        form.resetFields();
        this.setState({ reviewFormVisible: false });
      } else if (this.props.errorMessage) {
         message.error(`${this.props.errorMessage}`);
         this.props.clearErrors();
         return;
      }

    });
  };
  saveReviewFormRef = formRef => {
    this.formRef = formRef;
  };


  showAddGameDrawer = () => {
    this.setState({ addGameFormVisible: true});
  };

  handleAddGameOnClose = () => {
    this.setState({ addGameFormVisible: false });
  };

  handleAddGameCreate = async() => {
    const { form } = this.addGameformRef.props;
    form.validateFields(async(err, values) => {
      if (err) {
        return;
      }
      await this.props.saveGame(values);
      if(!this.props.errorMessage){
        await this.success('saved game')
        this.setState({ addGameFormVisible: false });
        window.location.reload(false)
          
      }else if (this.props.errorMessage) {
        message.error(`${this.props.errorMessage}`);
        this.props.clearErrors();
        return;
      }
    });
  };

  saveAddGameFormRef = formRef => {
    this.addGameformRef = formRef;
  };

  render() {
    const { initLoading, allgamesVisible, reviewFormVisible, addGameFormVisible, gameTitle} = this.state;
    const IconText = ({ type, text}) => (
      <span>
        <Icon type={type} style={{ marginRight: 8, fontSize: '20px', color: '#08c' }} theme="outlined" />
            {(<span style={{  color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.3)'}}>
                      {text}
            </span>
            )}
      </span>
    );

    const AddReviewIconTextButton = ({ id, type, text, onClick}) => (
      <span>
        <div>
          <button id={id} onClick={ onClick} style={{border:'1px ', 'backgroundColor': 'transparent', display: 'flex', width: '150px'}}>
                <Icon type={type} style={{ marginRight: 8, fontSize: '20px', color: '#08c' }} theme="outlined" />
            {(<span style={{  color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.3)', cursor: 'auto'}}>
                        {text}
                    </span>
                )}
            </button>
            <ReviewCreateForm
                wrappedComponentRef={this.saveReviewFormRef}
                visible={reviewFormVisible}
                gameTitle={gameTitle}
                onCancel={this.handleReviewCancel}
                onCreate={this.handleReviewCreate}
            />
        </div>

      </span>
    );

    const ViewReviewsIconTextButton = ({ id, type, text, onClick}) => (
      <span>
          <button id={id} onClick={onClick} style={{border:'1px ', 'backgroundColor': 'transparent', display: 'flex', width: '150px'}}>
              <Icon type={type} style={{ marginRight: 8, fontSize: '20px', color: '#08c' }} theme="outlined" />
          {(<span style={{  color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.3)', cursor: 'auto'}}>
                      {text}
                  </span>
              )}
          </button>
      </span>
    );

    const menu = () => {
      return (
        <div>Categories:</div>,
        <Menu id="filterCategory" onClick={this.onClick}>
          {this.props.gamesCategories.map(obj => {
            return (<Menu.Item key={obj.Id}>{obj.Name}</Menu.Item>)
          })}
        </Menu>
      );
    }

    return (
       <div>
         {allgamesVisible ? 
                  <div style={{display: 'flex',  justifyContent: 'center', position: 'relative',
                  top: '10px', left:'20px'}}>
                  <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link" href='/#/dashboard'>
                      Hover to filter <Icon type="down" />
                    </a>
                  </Dropdown>,<br></br>,
                  </div> : <br/>}
            <List
                id="gamesList"
                className="gamesList"
                dataSource={this.props.allGames}
                itemLayout="vertical"
                size="large"
                pagination={{
                onChange: page => {
                    console.log('Page ', page);
                },
                pageSize: 3,
                }}
                footer={
                <div>
                    {(
                        <span style={{  color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.3)', 'textDecoration': 'underline'}}>
                         
                         <button style={{border:'1px ', 'backgroundColor': 'transparent', display: 'flex', width: '150px'}}
                          onClick={this.showAddGameDrawer}>
                             Add new game
                        </button>
                          <AddGameCreateForm
                            wrappedComponentRef={this.saveAddGameFormRef}
                            visible={addGameFormVisible}
                            onClose={this.handleAddGameOnClose}
                            onCreate={this.handleAddGameCreate}
                          />
                        </span>
                      )}

                </div>
                }
                loading={initLoading}
                renderItem={item => (
                <List.Item
                    id="gameItem"
                    key={item.Title}
                    actions={[
                    <IconText type="star-o" text={item.rating.toFixed(1)} key="list-vertical-star-o" />,
                    <AddReviewIconTextButton id="addreview" type="plus-circle" onClick= {e => {
                        this.onReviewIconClick(item.Title);
                        return this.showReviewModal();
                      }} text=" Add review" key="list-vertical-star-o"/>,
                    <ViewReviewsIconTextButton id="viewreviews" type="message" onClick = { e => {
                        this.props.history.push(`/gameReviews?gameId=${item.Id}`);
                      }} text="Reviews" key="list-vertical-message"/>,
                    ]}
                    extra={
                    <img
                        width={272}
                        alt="logo"
                        src={item.imageURL}
                    />
                    }
                >
                    <List.Item.Meta 
                      title={(
                          <span style={{  color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.3)'}}>
                          {item.Title}
                          </span>
                        )} 
                      publisher={(
                          <span style={{  color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.3)'}}>
                          {item.Publisher}
                          </span>
                        )} 
                      description={(
                          <span style={{  color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.3)'}}>
                          {item.description}
                          </span>
                        )} 
                    />
                    {(
                        <span style={{  color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.3)'}}>
                         {item.summary}
                        </span>
                      )}
                </List.Item>
                )}
            />,
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    allGames: state.games.allGames,
    gamesCategories: state.gamesCategory.categories,
    games: state.games,
    gamesCategory: state.gamesCategory,
    errorMessage: state.auth.errorMessage,
    auth: state.auth
  }
}

export default connect(mapStateToProps, actions)(Games);

/* "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" */