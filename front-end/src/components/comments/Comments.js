import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, Popconfirm, Icon, Button, Form, Avatar, message, Comment, Input } from 'antd';
import moment from 'moment';
import * as actions from '../../actions';
const { TextArea } = Input;
class ReviewComments extends Component {

  async componentDidMount() {
    const param = this.props.location.search; 

    if(this.props.location.search.includes('?reviewId=')) {  
        await this.props.clearErrors();
        
        const gameTitle = (param.split('gameTitle='))[2]
        const reviewId = param.split('=')[1].split('&')[0]
        await this.props.getUserData();
        await this.props.clearErrors();
        await this.props.getCommentsByUserAndReviewId(this.props.userId, reviewId);
        const newComment = this.props.userReview === 0 ? true : false;
        console.log('recieved new comment', this.props.userReview, 'newCommentBool', newComment)
        await this.props.getAllReviewComments(reviewId)
        this.setState({commentReviewId: reviewId});
        message.loading('Action in progress..', 1.5)

        .then(() => {
            this.setState({gameTitle, initLoading: false, reviewsCommentsData: this.props.allReviewComments, 
                     list: this.props.allReviewComments, newComment: newComment, editClicked: false})
              this.props.allReviewComments.map(obj => {
              this.setState(prevState => {
                const newItems = [...prevState.noOfLikes];
                newItems[obj.Id] = obj.noOfCommentsLikes

                return {noOfLikes: newItems};
            })
              return obj;
            })
  
            message.success(`Successfully loaded`, 2.5)
        })

    } else if (!this.props.location.search.includes('?reviewId=')){
        this.props.clearErrors();
        this.setState({list: [], initLoading: true})
        message.error('A review needs to be selected to see the comments')
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
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdateChange = this.handleUpdateChange.bind(this);
    this.handleUpdateSubmit = this.handleUpdateSubmit.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.state = {
      likeAction: [{}],
      noOfLikes: [{}],
      initLoading: true,
      reviewsCommentsData: [],
      list: [],
      commentReviewId: 0,
      commentContent: [],
      submitting: false,
      updateSubmitting: false,
      value: '',
      addedComment: false,
      gameTitle: '',
      editClicked: false,
    };
  }

  onLikeClick = async (commentId, userId, index) => {
    await this.props.clearErrors()
    console.log('current userId')
    Promise.all([this.props.saveReviewCommentLike({like: 'true', commentId, userId })])
    .then(async()=>{
      if(!this.props.errorMessage) {
        await this.props.getReviewCommentsNoOfLikes(commentId)
          this.setState(prevState => {
                const newItems = [...prevState.likeAction];
                newItems[commentId] = 'liked';
                return {likeAction: newItems};
          })
            this.setState(prevState => {
              const newItems = [...prevState.noOfLikes];
              newItems[commentId]= this.state.noOfLikes[commentId] + 1;
              return {noOfLikes: newItems};
          })
        
      } else if (this.props.errorMessage) {
          message.error(`${this.props.errorMessage}`);
          this.props.clearErrors();   
      }
    })
  };

  onLikeUndo = async(item, userId, index) => {
   await this.props.clearErrors();
    if( this.state.noOfLikes[item.Id] && this.state.noOfLikes[item.Id] > 0) {
        await this.props.deleteReviewCommentLike(item.Id, userId);
        if(!this.props.errorMessage) {
          this.setState(prevState => {
              const newItems = [...prevState.likeAction];
              newItems[item.Id] = 'unliked';
              return {likeAction: newItems};
          })
          
          this.setState(prevState => {
              const newItems = [...prevState.noOfLikes];
              newItems[item.Id]= this.state.noOfLikes[item.Id] - 1 ;
              return {noOfLikes: newItems};
          })

          if(this.state.noOfLikes[item.Id] === 1) {
            this.setState(prevState => {
              const newItems = [...prevState.noOfLikes];
              newItems[item.Id]= 0 ;
              return {noOfLikes: newItems};
            })
          }


        } else if (this.props.errorMessage) {
            message.error(`${this.props.errorMessage}`);
            this.props.clearErrors();
        }
    } else {
        this.setState(prevState => {
          const newItems = [...prevState.noOfLikes];
          newItems[item.Id]= 0 ;
          return {noOfLikes: newItems};
        })
    }

  };

  handleSubmit = async() => {
    if (!this.state.value) {
      return;
    }
    if(this.checkLength(this.state.value)) {
        message.error('Please input more than one word for comment content');
        return;
    }
    this.setState({
      submitting: true,
    });
    await this.props.clearErrors();
    await this.props.saveReviewComment({title: `Review Comment`,
        content: this.state.value, userId: this.props.userId, reviewId: this.state.commentReviewId});
    if (!this.props.errorMessage) {
        
        this.setState(prevState => {
            const newItems = [...prevState.list];
            const newListLength = newItems.length + 1;
            
            const userComment = {
                Id: this.props.userReview[0].Id,
                userId: this.props.userId,
                username: this.props.user,
                userProfilePhoto: this.props.profilePhoto,
                content: this.state.value,
            }
            newItems.splice(newListLength, 0, userComment)
            return {list: newItems};
        })
        this.setState({ newComment: false, submitting: false, value: ''})
        } else if (this.props.errorMessage) {
            message.error(`${this.props.errorMessage}`);
            this.props.clearErrors();
            this.setState({
                submitting: false,
              });
            return;
        }
  };

  handleUpdateSubmit = async(item, index) => {
    if (!this.state.updateValue) {
      return;
    }
    if(this.checkLength(this.state.updateValue)) {
        message.error('Please input more than one word for comment content');
        return;
    }

    this.setState({
      updateSubmitting: true,
    });
    await this.props.clearErrors();
    await this.props.updateReviewComment({title: `Review Comment`,
        content: this.state.updateValue, userId: this.props.userId, reviewId: this.state.commentReviewId})
    if (!this.props.errorMessage) {

        this.setState({newComment: false, editClicked: false,
          updateSubmitting: false})
          window.location.reload(false)
        } else if (this.props.errorMessage) {
            message.error(`${this.props.errorMessage}`);
            this.props.clearErrors();
            this.setState({
                updateSubmitting: false,
              });
            return;
        }
  };

  handleChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  handleUpdateChange = e => {
    this.setState({
      updateValue: e.target.value,
    });
  };
  
  onDeleteClick = async(userId, index) => {
    await this.props.clearErrors();

    await this.props.deleteReviewComment(this.state.commentReviewId, userId);
    this.setState({ newComment: true})
    if(!this.props.errorMessage) {
      this.setState(prevState => {
          const newItems = [...prevState.list];
          newItems.splice(index, 1);
          return {list: newItems};
      })
      message.success(`Successfully deleted}`, 2.5)
    } else if (this.props.errorMessage) {
        message.error(`${this.props.errorMessage}`);
        this.props.clearErrors();
    }
  }

  checkLength (value) {
    const isSpaces = (!value.includes(' ') && (value.split(' ').length -1) === 0);
    const res = ((!isSpaces && !value.split(' ')[1]) || isSpaces)  ? true : false 
    return res;
  };
  render() {
    const { initLoading, noOfLikes, likeAction, list, value, submitting, updateSubmitting, newComment, updateValue} = this.state;



    const LikeIconTextButton = ({ type, text, onClick, theme, disabled}) => (
        <span>
            <button disabled={disabled} onClick = {onClick} style={{border:'1px ', 'backgroundColor': 'transparent', display: 'flex', width: '150px'}}>
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
           { <List
            dataSource={list}
            header={(
                <span style={{ marginRight: 5, fontSize: '20px', color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.3)'}}>
                {`${list.length} ${list.length > 1 ? 'comments' : 'comment'}`}
                </span>
              )}
            itemLayout="horizontal"
            className="comment-list"
            size="large"
            style={{minHeight: '350px'}}
            pagination={{
                onChange: page => {
                    console.log(page);
                },
                pageSize: 5,
                }}
            loading={initLoading}
            renderItem={(item, index) =>  (
                    <List.Item
                        key={item.Title}
                        actions={[
                            <div>{!newComment && item.userId === this.props.userId ? 
                            <span>
                                <Popconfirm
                                    id="deleteComment" 
                                    title="Are you sure delete this comment?"
                                    onConfirm={ e => {
                                        this.onDeleteClick(this.props.userId, index);
                                    }} 
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <LikeIconTextButton type="delete"  
                                        text="Delete Comment" key="list-vertical-delete" 
                                    />
                                </Popconfirm>
                                <LikeIconTextButton id="delete" type="edit"  
                                        onClick = { e => {
                                            this.setState({editClicked: true})
                                        }} 
                                        text="Edit" key="list-vertical-edit" 
                                    />
                                </span>  

                        :   
                            <span>
                                <LikeIconTextButton type="like" text={noOfLikes[item.Id]} theme={likeAction[item.Id] === 'liked' ? 'filled' : 'outlined'}
                                    disabled={likeAction[item.Id] === 'liked' ? true : false}
                                    onClick= { e => {
                                        this.onLikeClick(item.Id, this.props.userId, index);
                                    }} 
                                        key="list-vertical-like" 
                                /> 
                                <LikeIconTextButton type="undo"  
                                    onClick = { e => {
                                        
                                        this.onLikeUndo(item, this.props.userId, index);
                                    }} 
                                    text="Undo Like" key="list-vertical-undo" 
                                /></span>}</div>]}
                        >
                          <List.Item.Meta
                            avatar={<Avatar src={item.userProfilePhoto} />}
                            title={(
                                <span style={{ marginRight: 5, fontSize: '20px', color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.3)'}}>
                                {item.username}
                                </span>
                              )}
                            description={(
                                <span style={{  color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.3)'}}>
                                    { this.state.editClicked && item.userId === this.props.userId? 
                                    <div>
                                       <Form.Item hasFeedback>
                                            <TextArea rows={4} onChange={this.handleUpdateChange} placeholder={item.content} value={updateValue} onBlur={this.OnBlur}/>
                                        </Form.Item>
                                        <Form.Item>
                                            <Button id="updateComment" htmlType="submit" loading={updateSubmitting} onClick={e => {
                                                
                                                this.handleUpdateSubmit(item, index);
                                            }} type="primary">
                                                Update Comment
                                            </Button>
                                        </Form.Item>
                                
                                    </div> :<p>{item.content}</p>}
                                </span>
                         )}                           
                          />

                        </List.Item>
            )}
        />}
        
        
        <div> {newComment &&  <Comment
            avatar={<Avatar src={this.props.profilePhoto} />}
            content={
             <div>
                <Form.Item hasFeedback>
                     <TextArea rows={4} onChange={this.handleChange} value={value} onBlur={this.OnBlur}/>
                </Form.Item>
                <Form.Item>
                <Button id="addComment" htmlType="submit" loading={submitting} onClick={this.handleSubmit} type="primary">
                    Add Comment
                </Button>
                </Form.Item>
            
           </div> }
           datetime={moment().fromNow()}
        />}

      </div>
        </div>
                                
    );
  }
}

function mapStateToProps(state) {
  return {
    userId: state.dash.userId,
    profilePhoto: state.dash.profilePhoto,
    user: state.dash.user,

    userReview: state.reviews.getUserComment,
    allReviewComments: state.reviews.getAllReviewComments,
    allLikes: state.reviews.commentLikes,
    errorMessage: state.auth.errorMessage,
    auth: state.auth
  }
}

export default connect(mapStateToProps, actions)(ReviewComments);
