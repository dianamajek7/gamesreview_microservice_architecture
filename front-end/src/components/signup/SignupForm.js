import React from 'react';
import { reduxForm } from 'antd-form-redux';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Recaptcha from'react-recaptcha'
import {Form, Input, Tooltip, DatePicker, Icon, Upload, Row, Col, Checkbox, Button, Cascader} from 'antd';
import moment from 'moment';
import {Formik} from "formik";
import * as Yup from 'yup';
import * as actions from '../../actions';
import CustomInput from '../CustomInput';

const FormItem = Form.Item;
const PASSWORD_REGEX =  /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/;
const dateFormat = 'DD/MM/YYYY';
const privacyUrl = 'https://www.privacypolicies.com/privacy/view/0acaca0393033a456a22115fe0b454e0'

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

class Signup extends React.Component {

  constructor(props){
    super(props);

    this.onLoadRecaptcha = this.onLoadRecaptcha.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = { 
      imageUrl: '',
    }
    
  }

  componentDidMount() {
    if (this.captchaSecurity) {
      console.log("started captcha, ...")
      this.resetCaptcha();
    }
  }

  onLoadRecaptcha() {
    console.log('captcha successfully loaded');
    if (this.captchaSecurity) {
      this.resetCaptcha();
    }
  }

  resetCaptcha = () => {
    this.captchaSecurity.reset();
  }
  
  handleChange = (info) => { 
    switch (info.file.status) {
      case "uploading":
          getBase64(info.file.originFileObj, imageUrl => this.setState({ imageUrl }));
        break;
      case "done":
          getBase64(info.file.originFileObj, imageUrl => this.setState({ imageUrl }));
        break;

      default:
    }
  }

  render() {
    const { imageUrl } = this.state;
    const formItemLayout = {
      style: {
        position: 'relative', top: '30px', left: '250px'
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    
    const dobItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
    };

    const signupValidator = Yup.object().shape({
      firstname: Yup.string().required('First name is required!'),
      lastname: Yup.string().required('Lat name is required!'),
      email: Yup.string().email('Invalid email address').required('Email is required!'),
      password: Yup.string()
        .required('No password provided.')
        .min(7, 'Password is too short - should be 7 chars minimum.')
        .max(80, 'Password is too long - should be 80 chars or less.')
        .matches(PASSWORD_REGEX, `Password must contain at least one uppercase, 
          one lowercase letter, one number and one special character.`),
      confirmPassword: Yup.string().required('Confirm password!')
        .oneOf([Yup.ref('password'), null], 'Passwords must match'),
      dob: Yup.string().required('Enter your date of birth')
        .test('match', `DOB must be past dates`, 
        function (dob) {
          return (moment(dob, dateFormat) < new Date() && !moment(dob, dateFormat).isSame(Date.now(), 'day'))
        }),
      username: Yup.string().required('Username is required!'),
      profileImageURL: Yup.string().required('Choose a profile picture'),
      securityQuestion1: Yup.string().required('Select a question')
      .test('match', 'Choose a differrent question', 
        function (securityQuestion1) { 
          return (securityQuestion1 !== this.parent.securityQuestion2)
       }),
      securityAnswer1: Yup.string().required('Enter your answer')
      .test('match', 'Answer must be different', 
        function (securityAnswer1) { 
          return (securityAnswer1 !== this.parent.securityAnswer2)
      }),
      securityQuestion2: Yup.string().required('Select a question')
      .test('match', 'Choose a differrent question',
        function (securityQuestion2) { 
          return (securityQuestion2 !== this.parent.securityQuestion1)
      }),
      securityAnswer2: Yup.string().required('Enter your answer')  
      .test('match', 'Answer must be different',
        function (securityAnswer2) { 
          return (securityAnswer2 !== this.parent.securityAnswer1)
      }),
      allowed: Yup.string().required('Verify with captcha!'),
      checked: Yup.boolean().required('Must Accept Terms and Condition')
      
    });

    const question1Style = {
      style: {
        width: '250px',
        display: 'flex' , 
        justifyContent: 'center',
        position: 'relative', top: '5px', left: '150px'
      },
    };
    
    const question2Style = {
      style: {
        width: '250px',
        display: 'flex' , 
        justifyContent: 'center',
        position: 'relative', top: '-35px', left: '150px'
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };

    const profileProp = {
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      transformFile(file) {
        return new Promise(resolve => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            const canvas = document.createElement('canvas');
            const img = document.createElement('img');
            img.value = {imageUrl}
            img.src = reader.result;
            
            img.onload = () => {
              canvas.toBlob(resolve);
            };
            
          };
        });
      },
    };

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    const questionOptions = [
     {value: 'When is your anniversary?', label: 'when is your anniversary?'},
     {value: 'What was your first car?', label: 'What was your first car?'},
     {value: 'What is your favourite meal?', label: 'What is your favourite meal?'},
     {value: 'What is the middle name of your oldest child?', label: 'What is the middle name of your oldest child?'},
     {value: 'What is your oldest cousin’s first name?', label: 'What is your oldest cousin’s first name?'},
     {value: 'What is the title and artist of your favorite song?', label: 'What is the title and artist of your favorite song?'},
     {value: 'In what city or town did your mother and father meet?', label: 'In what city or town did your mother and father meet?'},
     {value: 'What was your first car’s make and model?', label: 'What was your first car’s make and model?'},
     {value: 'What is the name of your favorite childhood friend?', label: 'What is the name of your favorite childhood friend?'},
     {value: 'What was your favorite sport in high school?', label: 'What was your favorite sport in high school?'}
    ]
    
    return (
      <div>
        <Formik
          initialValues={{firstname: '', lastname: '', email: '', password: '', confirmPassword: '', 
          dob: '', username: '', allowed: '', profileImageURL: '', securityQuestion1: '', securityAnswer1: '',
           securityQuestion2: '', securityAnswer2: '', checked: ''}}
          validationSchema= {signupValidator}
          onSubmit={async(values) => {
            this.props.clearErrors();
            this.props.signup(values);
            if (!this.props.errorMessage) {
              this.props.history.push('/login');
            }
          }}
          render={({
            touched,
            errors,
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue
          }) => (
            <Form {...formItemLayout} id="signupForm" onSubmit={handleSubmit} className="signup-form">
              <div className="col-lg-12 text-center">
                <h1 className="mt-5" style={{display: 'flex', justifyContent: 'center', position: 'relative',
                    bottom: '10px', left: '50px'}}>Register</h1>
              </div>
              <FormItem
                label={(
                  <span style={{  color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.3)'}}>
                  Firstname
                  </span>
                )} 
                hasFeedback
              >
                <Input {...CustomInput } 
                    id="firstname"
                    name="firstname" type="text" 
                    placeholder="First Name"
                    value={values.firstname} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.firstname && touched.firstname && "error"}
                />
                {errors.firstname && touched.firstname && ( <div className="input-feedback">{errors.firstname}</div> )}
              </FormItem>
              <FormItem

                label={(
                  <span style={{  color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.3)'}}>
                  Lastname
                  </span>
                )} 
                hasFeedback
              >
                  <Input {...CustomInput }
                    id="lastname"
                    name="lastname" type="text"
                    placeholder="Last Name"
                    value={values.lastname} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.lastname && touched.lastname && "error"}
                  />
                  {errors.lastname && touched.lastname && ( <div className="input-feedback">{errors.lastname}</div> )}
              </FormItem>
              <FormItem
                label={(
                  <span style={{  color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.3)'}}>
                    E-mail
                  </span>
                )}
                hasFeedback
              >
                <Input {...CustomInput } prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)'}} />}
                  id="email"
                  name="email" type="text" 
                  placeholder="Enter your email here"
                  value={values.email} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.email && touched.email && "error"}
                />
                {errors.email && touched.email && ( <div className="input-feedback">{errors.email}</div> )}
              </FormItem>
              <FormItem
                label={(
                  <span style={{  color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.3)'}}>
                    Password
                  </span>
                )}
                hasFeedback
              >
                <Input {...CustomInput } prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)'}} />}
                  id="password"
                  name="password" type="password" 
                  placeholder="Enter your password here"
                  value={values.password} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.password && touched.password && "error"}
                />
                {errors.password && touched.password && ( <div className="input-feedback">{errors.password}</div> )}
              </FormItem>
              <FormItem prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)'}} />}
                label={(
                  <span style={{  color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.3)'}}>
                    Confirm Password
                  </span>
                )}
                hasFeedback
              >
                <Input {...CustomInput } prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)'}} />}
                  id="confirmPassword"
                  name="confirmPassword" type="password" 
                  placeholder="Confirm your password"
                  value={values.confirmPassword} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.confirmPassword && touched.confirmPassword && "error"}
                />
                {errors.confirmPassword && touched.confirmPassword && ( <div className="input-feedback">{errors.confirmPassword}</div> )}
              </FormItem>
              <FormItem
                label={(
                  <span style={{  color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.3)'}}>
                    Username&nbsp;
                    <Tooltip title="What do you want others to call you?">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </span>
                )}
                hasFeedback
              >
                <Input {...CustomInput } prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  id="username"
                  name="username" type="username" 
                  placeholder="Enter your username here"
                  value={values.username} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.username && touched.username && "error"}
                />
                {errors.username && touched.username && ( <div className="input-feedback">{errors.username}</div> )}
              </FormItem>
              <Form.Item
                {...dobItemLayout} 
                label={(
                  <span style={{  color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.3)'}}>
                  Date Of Birth
                  </span>
                )} 
                hasFeedback
              >
                <DatePicker
                  id="dob"
                  name='dob' defaultValue={moment(new Date(), dateFormat)} 
                  format={dateFormat}
                  onChange={value => {
                    if(value && value.isValid()) setFieldValue('dob', new Date(value).toLocaleDateString('en-GB'), handleChange)
                    else setFieldValue('dob', '', handleChange)
                  }}
                  onBlur={event => {
                    event.target.name = 'dob';
                    handleBlur(event);
                }}
                  className={errors.dob && touched.dob && "error"}
                />
                {errors.dob && touched.dob && ( <div className="input-feedback">{errors.dob}</div> )}
              </Form.Item>
              <FormItem 
              label={(
                  <span style={{  color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.3)'}}>
                    Profile Picture
                  </span>
                )} 
                className="clearfix" hasFeedback>
                <Upload
                  {...profileProp}
                  id="imageURL"
                  name="profileImageURL"
                  listType="picture-card"       
                  showUploadList={false}
                  onChange={this.handleChange}
                  onBlur={event => {
                    event.target.name = 'profileImageURL';
                    handleBlur(event);
                }}
                  className={errors.profileImageURL && touched.profileImageURL && "error"}
                >
                  { imageUrl ? <img alt="" style={{ width: '100%' }} src={imageUrl} onLoad= {e=> {
                    setFieldValue("profileImageURL", imageUrl, handleChange)}
                    }/> : uploadButton} 
                </Upload>
                
                {errors.profileImageURL && touched.profileImageURL && ( <div className="input-feedback">{errors.profileImageURL}</div> )}
              </FormItem> <br />
      
              <FormItem
                label={(
                  <span style={{  color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.3)'}}>
                    Security Question 1
                  </span>
                )} 
              > <br />
                <Row gutter={8}>
                  <Col span={12}>
                  <Cascader style={{width: '300px','textShadow': '0 0 10px rgba(0,0,0,0.3)'}} 
                    id="securityQuestion1" 
                    name="securityQuestion1"  options={questionOptions} 
                    onChange={(value) => setFieldValue('securityQuestion1', value.toString(), handleChange)}
                    onBlur={event => {
                      event.target.name = 'securityQuestion1';
                      handleBlur(event);
                  }}
                    className={errors.securityQuestion1 && touched.securityQuestion1 && "error"}
                  /> <br />
                  {errors.securityQuestion1 && touched.securityQuestion1 && ( <div className="input-feedback">{errors.securityQuestion1}</div> )}
                  </Col>
                  <Col span={12}>
                    <Input {...CustomInput } {...question1Style} id="securityAnswer1" name="securityAnswer1" 
                      placeholder="Enter your answer"
                      value={values.securityAnswer1} 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={ errors.securityAnswer1 && touched.securityAnswer1 && "error"}
                    />
                    {errors.securityAnswer1 && touched.securityAnswer1 && ( <div className="answerOne-input-feedback">{errors.securityAnswer1}</div> )}
                  </Col>
                </Row>
              </FormItem>
      
              <FormItem
                label={(
                  <span style={{  color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.3)'}}>
                    Security Question 2
                  </span>
                )} 
              ><br />
                <Row gutter={8}>
                  <Col span={12}>
                  <Cascader style={{width: '300px', 'textShadow': '0 0 10px rgba(0,0,0,0.3)'}} id='securityQuestion2'
                    name="securityQuestion2" options={questionOptions} 
                    onChange={(value) => setFieldValue('securityQuestion2', value.toString(), handleChange)}
                    onBlur={event => {
                      event.target.name = 'securityQuestion2';
                      handleBlur(event);
                  }}
                    className={errors.securityQuestion2 && touched.securityQuestion2 && "error"}
                  /> <br />
                  {errors.securityQuestion2 && touched.securityQuestion2 && ( <div className="input-feedback">{errors.securityQuestion2}</div> )}
                  </Col>
                  <Col span={12}>
                    <br/>
                    <Input {...CustomInput } {...question2Style} id="securityAnswer2"  name="securityAnswer2" 
                      placeholder="Enter your answer"
                      value={values.securityAnswer2} 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.securityAnswer2 && touched.securityAnswer2 && "error"}
                    />
                    {errors.securityAnswer2 && touched.securityAnswer2 && ( <div className="answerTwo-input-feedback">{errors.securityAnswer2}</div> )}
                  </Col>
                </Row>
              </FormItem> <br />
              <FormItem
                label={(
                  <span style={{  color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.3)'}}>
                  Captcha
                  </span>
                )} 
                extra={(
                  <span style={{  color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.3)'}}>
                    We must make sure that your are a human.
                  </span>
                )} 
              >
                <Row gutter={8}>
                  <Col span={12}>
      
                  <Recaptcha name="allowed"
                      ref={(el) => {this.captchaSecurity = el;}} 
                      size="normal"
                      data-theme="dark"
                      sitekey="6LfXK78UAAAAACJ-UnYeiFPp4JhiPzaWFgsHIILm"
                      render="explicit"
                      verifyCallback= {(response) => {setFieldValue("allowed", (response ? 'true' : 'false'), handleChange)}}
                      onloadCallback={this.onLoadRecaptcha} 
                      onBlur={event => {
                        event.target.name = 'allowed';
                        handleBlur(event);
                    }}
                      className={errors.allowed && touched.allowed && "error"}
                  />
                    {errors.allowed && touched.allowed && <div className="input-feedback">{errors.allowed}</div>} 
                  </Col>
                </Row>
              </FormItem>
              <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }} hasFeedback>
                  <Checkbox id="checkbox"name="checked"
                    onChange={(value) => {
                      setFieldValue('checked', (value.target.checked ? true : ''), handleChange.checked, handleChange)
                    }}
                    onBlur={event => {
                      event.target.name = 'checked';
                      handleBlur(event);
                  }}
                    className={errors.checked && touched.checked && "error"}
                  > <span style={{  color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.3)'}}>
                I have read the </span> <a target="_blank" rel="noopener noreferrer"  href={privacyUrl}>agreement</a>
                  </Checkbox>
                  {errors.checked && touched.checked && <div className="input-feedback">{errors.checked}</div>} 
              </FormItem> 
              <FormItem {...tailFormItemLayout} hasFeedback style={{display: 'flex', justifyContent: 'center', left: '20%'}}>
                  <Button id='submit' type="primary" htmlType="submit" 
                    disabled={!this.props.errorMessage && isSubmitting ? isSubmitting : false}>
                      {!this.props.errorMessage &&  isSubmitting ? "Please wait..." : "Register"}
                  </Button>
              </FormItem>
              { this.props.errorMessage ? 
                      <div id='error' className="alert alert-danger">
                        { this.props.errorMessage }
                      </div> : null }
            </Form>
          )}
        />
      </div>
    );
 
  }
}

function mapStateToProps(state) {
  return { 
    errorMessage: state.auth.errorMessage
  }
}

export default compose(
  connect(mapStateToProps, actions),
  reduxForm({ form: 'signup' })
)(Signup)