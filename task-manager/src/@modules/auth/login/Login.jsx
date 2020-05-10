import React from 'react';
import './Login.scss';
import { connect } from 'react-redux';
import DBAuthManager from '../../../@shared/services/db-auth-manager';
import { Formik, Form, Field, ErrorMessage } from 'formik';

class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            requestErrorMsg: ''
        };
        this.login = login.bind(this);
    }

    render() {
        return (
            <div className="login">
                <img className="logo" src="/assets/images/logo512.png" alt="logo" />

                <Formik
                    initialValues={{
                        email: '',
                        password: ''
                    }}
                    validate={
                        values => {
                            const errors = {};
                            if (!values.email) {
                                errors.email = 'Email is required';
                            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                                errors.email = 'Invalid email address';
                            }

                            if (!values.password) {
                                errors.password = 'Password is required';
                            }

                            if (errors !== {}) {
                                this.setState({
                                    requestErrorMsg: ''
                                });
                            }
                            return errors;
                        }
                    }
                    onSubmit={(values) => {
                        this.login(values);
                    }}
                >
                    {
                        () => (
                            <Form className="login-form">
                                <div className="form-group">
                                    <Field type="email" name="email" placeholder="Email" />
                                    <ErrorMessage name="email" component="div" className="error-msg" />
                                </div>
                                <div className="form-group">
                                    <Field type="password" name="password" placeholder="Password" />
                                    <ErrorMessage name="password" component="div" className="error-msg" />
                                    {this.state.requestErrorMsg !== '' ? <div className="error-msg">{this.state.requestErrorMsg}</div> : null}
                                </div>
                                <input className="btn-login" type="submit" value="Login" />
                            </Form>
                        )
                    }
                </Formik>
            </div>
        );
    }
}

export default connect()(Login);

async function login(values) {
    let email = values.email;
    let password = values.password;

    let loggedUserRole = await DBAuthManager.login(email, password);

    if (loggedUserRole) {
        switch (loggedUserRole) {
            case 'admin':
                this.props.dispatch({
                    type: 'LOGIN_USER',
                    userRole: 'admin',
                    userEmail: email
                });
                this.props.history.push('/admin/dashboard');
                break;
            case 'user':
                this.props.dispatch({
                    type: 'LOGIN_USER',
                    userRole: 'user',
                    userEmail: email
                });
                this.props.history.push('/user/dashboard');
                break;
            default:
                break;
        }
    } else {
        this.setState({
            requestErrorMsg: 'No such user found with these credentials!'
        });
    }
}