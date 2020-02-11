import React from 'react';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Form, Input, Tooltip, Icon, Button, PageHeader} from 'antd';
import {Formik} from "formik";
import * as Yup from 'yup';
import * as actions from '../../actions';
import CustomInput from '../CustomInput';

const FormItem = Form.Item;
const PASSWORD_REGEX =  /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/;

class Login extends React.Component {
  async componentDidMount() {
    this.props.clearErrors();
  }


  constructor(props) {
    super(props);

    this.state = { 
    }
    this.baseState = this.state
  }
    

  render() {
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
        sm: { span: 14 },
      },
    };
    const LoginValidator = Yup.object().shape({
      username: Yup.string().required('Username is required!'),
        password: Yup.string()
          .required('No password provided.')
          .min(7, 'Password is too short - should be 7 chars minimum.')
          .max(80, 'Password is too long - should be 80 chars or less.')
          .matches(PASSWORD_REGEX, `Password must contain at least one uppercase, 
            one lowercase letter, one number and one special character.`)
      });
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

    return (
    <div className="row" >
        <Formik
           initialValues={{username: '', password: ''}}
        
          validationSchema= {LoginValidator}

          onSubmit= {async(values) => {
              await this.props.login(values);
              if(!this.props.errorMessage || this.props.isSubmitting) {
                if(this.props.isAdminLogged)
                  this.props.history.push('/adminPortal');
                else 
                  this.props.history.push('/dashboard');
              }
          }}
          render={({
            touched,
            errors,
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting
          }) => (
            <div className="col">
            <Form {...formItemLayout} onSubmit={handleSubmit} className="login-form">
                <PageHeader> 
              <div className="col-lg-12">
                <h1 className="mt-5" style={{display: 'flex', justifyContent: 'center', position: 'relative',
                  bottom: '10px', left: '50px'}}>Login</h1>
              </div>
            </PageHeader>
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
                <Input {...CustomInput} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  name="username" type="username"
                  placeholder="Enter your username here"
                  value={values.username} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.username && touched.username && "error"}
                />
                {errors.username && touched.username && ( <div className="input-feedback">{errors.username}</div> )}
              </FormItem>
              <FormItem
                label={(
                  <span style={{  color: '#fff', textShadow: '0 0 10px rgba(0,0,0,0.3)'}}>
                    Password
                  </span>
                )}
                hasFeedback
              >
                <Input {...CustomInput}  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)'}} />}
                  name="password" type="password" 
                  placeholder="Enter your password here"
                  value={values.password} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.password && touched.password && "error"} 
                />
                {errors.password && touched.password && ( <div className="input-feedback">{errors.password}</div> )}
              </FormItem>
            
              <FormItem {...tailFormItemLayout} hasFeedback style={{display: 'flex', justifyContent: 'center', left: '20%'}}>
                <Button id='submitButton' type="primary" htmlType="submit" 
                disabled={!this.props.errorMessage && isSubmitting ? isSubmitting : false}>
                  {!this.props.errorMessage &&  isSubmitting ? "Please wait..." : "Login"}
                  </Button>
              </FormItem>
              
              { this.props.errorMessage ? 
                  <div id='error' className="alert alert-danger">
                    { this.props.errorMessage }
                  </div> : null}
          </Form>
          </div>
          )}
        />
  </div>
    );
 
  }
}


function mapStateToProps(state) {
  return {
    isAdminLogged: state.auth.isAdmin,
    errorMessage: state.auth.errorMessage,
  }
}

export default compose(
  connect(mapStateToProps, actions),
  reduxForm({ form: 'login' })
)(Login)
