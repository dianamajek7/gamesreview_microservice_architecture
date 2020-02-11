import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'antd/dist/antd.css';
import { Icon, Table, Divider, Tag, Popconfirm, message } from 'antd';
import * as actions from '../../actions';

const { Column, ColumnGroup } = Table;

class Admin extends Component {
  async componentDidMount() {

    this.setState({initLoading: true})
    Promise.all([this.props.dispatchisAdmin(), this.props.clearErrors(),
      this.props.getAllUsersReviews()]).then(()=> {
        message.loading('Action in progress..', 2.5).then(()=> {
          this.setState({dataList: this.props.allReviews, initLoading: false});
          message.success(`Successfully loaded`, 2.5);
        })
      })

  }

  constructor(props){
    super(props);

    this.onUpdateClick = this.onUpdateClick.bind(this);
    this.onDeleteClick  = this.onDeleteClick.bind(this);

    this.state = {
        dataList: [],
        initLoading: true,

    };
    
  }

  onUpdateClick = async(reviewId)=> {
    await this.props.clearErrors();
    await this.props.updateReviewFlag(reviewId)
    console.log('reviewId',reviewId);
    await this.props.getAllUsersReviews();
    console.log('result', this.props.allReviews);
    this.props.allReviews.map(obj => { 
      const tempObj = obj;
      if(tempObj.Id === reviewId)
          obj.flag = "approved";
      return tempObj;
    })
    this.setState({
      dataList: this.props.allReviews,
    });
  };

  onDeleteClick = async(reviewId)=> {
    await this.props.clearErrors();
    await this.props.deleteReviewFlag(reviewId);

    this.setState(prevState => {
      const newItems = [...prevState.dataList];
      newItems.map((obj, index) => { 
        const tempObj = obj;
        if(tempObj.Id === reviewId)
          newItems.splice(index, 1);
        return tempObj;
      })
      
      return {dataList: newItems};
    })
    message.success('Successfully deleted', 2.5)
  };

  render() {
    const { dataList, initLoading } = this.state;
    return (
      <div>
        <Table dataSource={dataList} loading= {initLoading}>
            <Column title="Username" dataIndex="username" key="username"
                render={(text, record) => (
                    <span style={{ color: '#fff',fontWeight: '700',textShadow: '0 0 10px rgba(0,0,0,0.3)'}}>
                            {record.username}
                            </span>
                        )}/>
            <ColumnGroup title="Review" key="columgroup">
            <Column title="Review Id" dataIndex="Id" key="Id" 
            render={(text, record) => (
               <span style={{ color: '#fff',fontWeight: '900',textShadow: '0 0 10px rgba(0,0,0,0.3)'}}>
                    {record.Id}
                    </span>
                  )}/>
            <Column title="Title" dataIndex="Title" key="Title"
                render={(text, record) => (
                <span style={{ color: '#fff',fontWeight: '700',textShadow: '0 0 10px rgba(0,0,0,0.3)'}}>
                        {record.Title}
                        </span>
                    )}/>
            <Column title="Content" dataIndex="content" key="content"
                render={(text, record) => (
                <span style={{ color: '#fff',fontWeight: '700',textShadow: '0 0 10px rgba(0,0,0,0.3)'}}>
                        {record.content}
                        </span>
                    )}/>
            <Column
                title="Flag"
                dataIndex="flag"
                key="flag"
                render={flag => (
                    <span>
                    {flag === "pending" ?   <Tag color="red" key={flag}>
                        {flag}</Tag> : <Tag color="green" key={flag}>{flag}</Tag>
                        }
                    </span>
                )}
            />
            </ColumnGroup>


            <Column
                title="Action"
                key="action"
                render={(text, record) => (
                    <span>
                        {record.flag === "approved" ?
                          <span>
                                <Popconfirm
                                        title="Are you sure delete this comment?"
                                        onConfirm={() => this.onDeleteClick(record.Id)} 
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                    <Icon type="delete" style={{ marginRight: 8, fontSize: '20px', color: '#08c' }}/>,
                                            {(<span style={{  color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.3)', cursor: 'auto' }}>
                                                    Delete Review
                                                </span>
                                            )}
                                </Popconfirm>
                            </span>
                        :
                            <span>
                             <Icon type="check-circle" onClick={()=>this.onUpdateClick(record.Id)} style={{ marginRight: 8, fontSize: '20px', color: '#08c' }}/>, 
                                {(<span style={{  color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.3)', cursor: 'auto' }}>
                                        Approve Review
                                </span>
                                )}
                              <Divider type="vertical" />,
                                <Popconfirm
                                        title="Are you sure delete this comment?"
                                        onConfirm={() => this.onDeleteClick(record.Id)} 
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                    <Icon type="delete" style={{ marginRight: 8, fontSize: '20px', color: '#08c' }}/>,
                                            {(<span style={{  color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.3)', cursor: 'auto' }}>
                                                    Delete Review
                                                </span>
                                            )}
                                </Popconfirm>,
                            </span>}, 
                    </span>
                )}
            />,
        </Table>
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {

    allReviews: state.admin.allUsersReviews,
    errorMessage: state.auth.errorMessage,
    auth: state.auth
  }
}

export default connect(mapStateToProps, actions)(Admin);
