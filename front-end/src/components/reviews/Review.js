/* eslint-disable eqeqeq */
import React from 'react';
import 'antd/dist/antd.css';
import './Review.css'
import {Modal, Form, Input, Rate, Upload, Icon, message } from 'antd';

const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

export const ReviewCreateForm = Form.create({ name: 'review_form_in_modal' })(
  class extends React.Component {
    async getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
      
    async beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    }

    constructor(props){
        super(props);
    
        this.handleUploadChange = this.handleUploadChange.bind(this)
        this.handleRateChange = this.handleRateChange.bind(this);
        this.compareToGameTitle = this.compareToGameTitle.bind(this);
        this.checkLength = this.checkLength.bind(this);
        this.state = {
            loading: false,
            value: 3,
        };
    }


  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values');
      }
    });
  };

  handleConfirmBlur = e => {
    const { gameTitle } = this.props;
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value || value !== gameTitle});
  };
  handleContentBlur = e => {
    const { value } = e.target;
    const isSpaces = (!value.includes(' ') && (value.split(' ').length -1) === 0);
    const res = ((!isSpaces && !value.split(' ')[1]) || isSpaces)  ? true : false 

    this.setState({ confirmDirty: this.state.confirmDirty || res});
  };
    handleUploadChange = info => {
        if (info.file.status === 'uploading') {
          this.setState({ loading: true });
          return; 
        }
        if (info.file.status === 'done') {
          this.getBase64(info.file.originFileObj, imageUrl =>
            this.setState({
                imageUrl,
                loading: false,
              }),
          );
        }
    };

    
    handleRateChange = value => {
        this.setState({ value });
        if(value) this.props.form.setFieldsValue({rate: value });
    };

    compareToGameTitle = (rule, value, callback) => {
      const { gameTitle, form } = this.props;
      if (gameTitle && gameTitle !== form.getFieldValue('title')) {
        callback('Review title must match game title!');
      } else {
        callback();
      }
    };

    checkLength = (rule, value, callback) => {
      const { form } = this.props;
      value = form.getFieldValue('content')
      const isSpaces = (!value.includes(' ') && (value.split(' ').length -1) === 0);
      const res = ((!isSpaces && !value.split(' ')[1]) || isSpaces)  ? true : false 
      if (res) {
        callback('Please input more than one word for review content!');
      } else {
        callback();
      }
    };

    render() {
      const uploadButton = (
        <div>
            <Icon id="upload" type={this.state.loading ? 'loading' : 'plus'} />
            <div className="ant-upload-text">Add Screenshot</div>
        </div>
        );
      const { imageUrl, value } = this.state;  
      const { visible, gameTitle, onCancel, onCreate, form} = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="Add a new review"
          okText="Submit"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form id="reviewForm" layout="vertical" onSubmit={this.handleSubmit}>
            <Form.Item label="Title" hasFeedback>
              {getFieldDecorator('title', {
                initialValue: gameTitle,
                rules: [{ required: true, message: 'Please input the review title!' },
                  {validator: this.compareToGameTitle}],
              })(<Input onBlur={this.handleConfirmBlur}/>)}
            </Form.Item>
            <Form.Item id="content" label="Content" hasFeedback>
              {getFieldDecorator('content', {
                rules: [{ required: true, message: 'Please input review content' },
                {validator: this.checkLength}],
              })(<Input type="textarea" onBlur={this.handleContentBlur}/>)}
            </Form.Item>
            <Form.Item >
              {getFieldDecorator('screenshot')(
                <Upload
                    id="screenshot"
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    beforeUpload={this.beforeUpload}
                    onChange={this.handleUploadChange}
                >
                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} onLoad= {e=> {
                        this.props.form.setFieldsValue({screenshot: imageUrl})}
                    }/> : uploadButton}
                 </Upload>
              )}
            </Form.Item>
            <Form.Item className="collection-create-form_last-form-item">
              {getFieldDecorator('rate', {
                rules: [{ required: true, message: 'Please give your rating!' }],
              })(
                <span>
                    <Rate tooltips={desc} onChange={this.handleRateChange} value={value} />
                    {value ? <span className="ant-rate-text">{desc[value - 1]} </span> : ''}
                </span>
              )}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  },
);
