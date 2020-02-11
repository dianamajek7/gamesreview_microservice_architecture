import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, Icon, Avatar, message} from 'antd';
import * as actions from '../../actions';

class GameReviews extends Component {

  async componentDidMount() {
    const param = this.props.location.search;
    
    if(this.props.location.search.includes('?gameId=')) {  
        this.props.clearErrors();
        const paramId = param.split('=')[1]
        await this.props.getUserData();
        await this.props.getAllGameReviews(paramId);
        this.setState({currentGameId: paramId})
        message.loading('Action in progress..', 1.5)
        .then(() => {
          if(!this.props.errorMessage && this.props.allGameReviews) {
            this.setState({dataLoading: false, reviewsData: this.props.allGameReviews})
            this.props.allGameReviews.map(obj => {
              this.setState(prevState => {
                const newItems = [...prevState.noOfLikes];
                // if(!obj.noOfreviewLikes)
                //   newItems[obj.Id] = 0
                // else
                newItems[obj.Id] = obj.noOfreviewLikes;
                return {noOfLikes: newItems};
            })
              return obj;
            })
            
            message.success(`Successfully loaded`, 2.5)
          }
        }).then(async () =>{
            if(this.props.errorMessage) {
                this.props.clearErrors();
                this.setState({dataLoading: true, reviewsData: []})
                message.error('no reviews yet for the particular game')
                this.props.history.push('/viewAllGames');
            }
        })

    } else if (!this.props.location.search.includes('?gameId=')){
        this.props.clearErrors();
        message.error('A game needs to be selected to see the review')
        this.props.history.push('/viewAllGames');
    }
  }

  async success(action) {
    message
      .loading('Action in progress..', 1.5)
      .then(() => message.success(`Successfully ${action}`, 2.5))
  };
  

  constructor(props){
    super(props);

    this.onLikeClick = this.onLikeClick.bind(this);
    this.onLikeUndo = this.onLikeUndo.bind(this);

    this.state = {
      likeAction: [{}],
      noOfLikes: [{}],
      dataLoading: true,
      reviewsData: [],
      currentGameId: 0,
    };
  }

  onLikeClick = async (reviewId, userId) => {
    this.props.clearErrors();
    Promise.all([this.props.saveReviewLike({like: 'true', reviewId, userId })])
    .then(async()=>{
      if(!this.props.errorMessage) {
        Promise.all([this.props.getNoOfLikes(reviewId)]).then(()=>{
          this.setState(prevState => {
            const newItems = [...prevState.likeAction];
            newItems[reviewId] = 'liked';
            return {likeAction: newItems};
          })
          this.setState(prevState => {
            const newItems = [...prevState.noOfLikes];
            newItems[reviewId] = this.props.allLikes;
            return {noOfLikes: newItems};
          })
        })

      } else if (this.props.errorMessage) {
          message.error(`${this.props.errorMessage}`);
          this.props.clearErrors();   
      }
    })
    
  };

  onLikeUndo = async(reviewId, userId) => {
    await this.props.clearErrors();
    if(this.state.noOfLikes[reviewId] > 0) {
        Promise.all([this.props.deleteReviewLike(reviewId, userId)])
        .then(()=> {
          if(!this.props.errorMessage) {
            this.setState(prevState => {
                const newItems = [...prevState.likeAction];
                newItems[reviewId] = 'unliked';
                return {likeAction: newItems};
            })
            
            Promise.all([this.props.getNoOfLikes(reviewId)])
            .then (()=>{
              this.setState(prevState => {
                const newItems = [...prevState.noOfLikes];
                newItems[reviewId] = this.props.allLikes;
                return {noOfLikes: newItems};
              })
            })
  
          } else if (this.props.errorMessage) {
              message.error(`${this.props.errorMessage}`);
              this.props.clearErrors();
          }
        })

    } else {
      this.setState(prevState => {
        const newItems = [...prevState.noOfLikes];
        newItems[reviewId] = 0;
        return {noOfLikes: newItems};
      })
    }

  };

  render() {
    const { noOfLikes, likeAction, dataLoading, reviewsData} = this.state;

    const AddCommentIconTextButton = ({ type, text, onClick}) => (
      <span>
        <div>
          <button id="addCommentButton" onClick = {onClick} style={{border:'1px ', 'backgroundColor': 'transparent', display: 'flex', width: '150px'}}>
                <Icon type={type} style={{ marginRight: 8, fontSize: '20px', color: '#08c' }} theme="outlined" />
            {(<span style={{  color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.3)', cursor: 'auto' }}>
                        {text}
                    </span>
                )}
            </button>
        </div>

      </span>
    );

    const LikeIconTextButton = ({ id, type, text, onClick, theme, disabled}) => (
      <span>
          <button id={id} disabled={disabled} onClick = {onClick} style={{border:'1px ', 'backgroundColor': 'transparent', display: 'flex', width: '150px'}}>
              <Icon type={type} style={{ marginRight: 8, fontSize: '20px', color: '#08c' }} theme={theme} />
          {(<span style={{ color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.3)', cursor: 'auto' }}>
                      {text}
                  </span>
              )}
          </button>
      </span>
    );

    return (
       <div>
            <List
                className="gamesList"
                itemLayout="vertical"
                size="large"
                pagination={{
                onChange: page => {
                    console.log(page);
                },
                pageSize: 3,
                }}
                loading={dataLoading}
                dataSource={reviewsData}
                renderItem={item => (
                <List.Item
                    key={item.Title}
                    actions={[
                    <AddCommentIconTextButton type="message"
                        onClick= {e => {
                          this.props.history.push(`/reviewComments?reviewId=${item.Id}&gameTitle=${item.Title}`);
                        }} 
                        text="Comments" key="list-vertical-message"
                    />,
                    <LikeIconTextButton id="like" type="like" text={noOfLikes[item.Id]} theme={likeAction[item.Id] === 'liked' ? 'filled' : 'outlined'}
                        disabled={likeAction[item.Id] === 'liked' ? true : false}
                        onClick= { e => {
                            this.onLikeClick(item.Id, this.props.userId);
                        }} 
                         key="list-vertical-like" 
                    />,
                    <LikeIconTextButton id="undo" type="undo"  
                        onClick = { e => {
                            this.onLikeUndo(item.Id, this.props.userId);
                        }} 
                        text="Undo Like" key="list-vertical-undo" 
                    />,
                    ]}
                    extra={
                    <img
                        width={272}
                        alt="logo"
                        src={item.screenshotImageURL}
                    />
                    }
                >
                    <List.Item.Meta
                      avatar={<Avatar src={item.userProfilePhoto} />}
                      title={(
                          <span style={{  color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.3)'}}>
                          {item.Title}
                          </span>
                        )}
                    />
                    {(
                        <span style={{  color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.3)'}}>
                         {item.content}
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
    userId: state.dash.userId,
    allGameReviews: state.reviews.allgameReviews,
    allLikes: state.reviews.likes,
    errorMessage: state.auth.errorMessage,
    auth: state.auth
  }
}

export default connect(mapStateToProps, actions)(GameReviews);
