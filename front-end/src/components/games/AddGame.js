import React from 'react';
import 'antd/dist/antd.css';
import {Drawer, Form, Button, Col, Row, Input, Upload, Icon, message } from 'antd';


export const AddGameCreateForm = Form.create({ name: 'addgame_form_in_modal' })(
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
        this.checkSummaryLength = this.checkSummaryLength.bind(this);
        this.checkDescritionLength = this.checkDescritionLength.bind(this)
        this.state = {
            loading: false,
            value: 3,
        };
    }


  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values with no errors');
      }
    });
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


    checkSummaryLength = (rule, value, callback) => {
      const { form } = this.props;
      value = form.getFieldValue('summary')
      const isSpaces = (!value.includes(' ') && (value.split(' ').length -1) === 0);
      const res = ((!isSpaces && !value.split(' ')[1]) || isSpaces)  ? true : false 
      if (res) {
        callback('Please input more than one word for review summary!');
      } else {
        callback();
      }
    };

    checkDescritionLength = (rule, value, callback) => {
        const { form } = this.props;
        value = form.getFieldValue('description')
        const isSpaces = (!value.includes(' ') && (value.split(' ').length -1) === 0);
        const res = ((!isSpaces && !value.split(' ')[1]) || isSpaces)  ? true : false 
        if (res) {
          callback('Please input more than one word for review description!');
        } else {
          callback();
        }
      };

    render() {
      const uploadButton = (
        <div>
            <Icon id="uploadbutton" type={this.state.loading ? 'loading' : 'plus'} />
            <div className="ant-upload-text">Add a Image</div>
        </div>
        );
      const { imageUrl} = this.state;  
      const { visible, onClose, onCreate, form} = this.props;
      const { getFieldDecorator } = form;
      return (
        <Drawer
          title="Add new game "
          width={720}
          onClose={onClose}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form id="gameForm" layout="vertical" onSubmit={this.handleSubmit} hideRequiredMark>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item id="title" label="Title" hasFeedback>
                    {getFieldDecorator('title', {
                        rules: [{ required: true, message: 'Please input a non existing review title!' }],
                    })(<Input placeholder="Enter title here"/>)}
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item id="categorryName" label="Category Name" hasFeedback>
                    {getFieldDecorator('categoryName', {
                        rules: [{ required: true, message: 'Please input the category name!' }],
                    })(<Input placeholder="Enter category name"/>)}
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item id="publisher" label="Publisher" hasFeedback>
                    {getFieldDecorator('publisher', {
                        rules: [{ required: true, message: 'Please input the publisher!' }],
                    })(<Input placeholder="Enter the publisher here"/>)}
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item id="summary" label="Summary" hasFeedback>
                    {getFieldDecorator('summary', {
                        rules: [{ required: true, message: 'Please input the summary of the game!' },
                        {validator: this.checkSummaryLength}],
                    })(<Input placeholder="Enter summary here" onBlur={this.handleContentBlur}/>)}
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item id="description" label="Description">
                  {getFieldDecorator('description', {
                    rules: [
                      { required: true, message: 'please enter the game description', },
                      {validator: this.checkDescritionLength}
                    ],
                  })(<Input.TextArea rows={4} placeholder="Enter game description here" onBlur={this.handleContentBlur}/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item>
                {getFieldDecorator('image')(
                    <Upload
                        id="uploader"
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        beforeUpload={this.beforeUpload}
                        onChange={this.handleUploadChange}
                    >
                        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} onLoad= {e=> {
                            this.props.form.setFieldsValue({image: imageUrl})}
                        }/> : uploadButton}
                    </Upload>
                )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <div
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            <Button id="cancel" onClick={onClose} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button id="addGameSubmit" onClick={onCreate} type="primary">
              Submit
            </Button>
          </div>
        </Drawer>
      );
    }
  },
);
