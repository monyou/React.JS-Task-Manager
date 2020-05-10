import React from 'react';
import './Register.scss';
import DBAuthManager from '../../../@shared/services/db-auth-manager';
import UserModel from '../../../@shared/models/user.model';
import { connect } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';

class Register extends React.Component {
    constructor() {
        super();
        this.state = {
            requestErrorMsg: ''
        };
        this.register = register.bind(this);
    }

    render() {
        return (
            <div className="register">
                <img className="logo" src="/assets/images/logo512.png" alt="logo" />

                <Formik
                    initialValues={{
                        names: '',
                        email: '',
                        password: '',
                        repPassword: ''
                    }}
                    validate={
                        values => {
                            const errors = {};
                            if (!values.names) {
                                errors.names = 'Names are required';
                            }

                            if (!values.email) {
                                errors.email = 'Email is required';
                            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                                errors.email = 'Invalid email address';
                            }

                            if (!values.password) {
                                errors.password = 'Password is required';
                            }

                            if (!values.repPassword) {
                                errors.repPassword = 'Repeat password is required';
                            } else if (values.password && (values.password !== values.repPassword)) {
                                errors.repPassword = 'Password missmatch';
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
                        this.register(values);
                    }}
                >
                    {
                        () => (
                            <Form className="register-form">
                                <div className="form-group">
                                    <Field type="text" name="names" placeholder="Names" />
                                    <ErrorMessage name="names" component="div" className="error-msg" />
                                </div>
                                <div className="form-group">
                                    <Field type="email" name="email" placeholder="Email" />
                                    <ErrorMessage name="email" component="div" className="error-msg" />
                                </div>
                                <div className="form-group">
                                    <Field type="password" name="password" placeholder="Password" />
                                    <ErrorMessage name="password" component="div" className="error-msg" />
                                </div>
                                <div className="form-group">
                                    <Field type="password" name="repPassword" placeholder="Repeat password" />
                                    <ErrorMessage name="repPassword" component="div" className="error-msg" />
                                    {this.state.requestErrorMsg !== '' ? <div className="error-msg">{this.state.requestErrorMsg}</div> : null}
                                </div>
                                <input className="btn-register" type="submit" value="Register" />
                            </Form>
                        )
                    }
                </Formik>
            </div>
        );
    }
}

export default connect()(Register);

async function register(values) {
    let names = values.names;
    let email = values.email;
    let password = values.password;

    let user = new UserModel(
        email,
        password,
        names
    );

    if (await DBAuthManager.register(user)) {
        this.props.dispatch({
            type: 'LOGIN_USER',
            userRole: 'user',
            userEmail: email
        });
        this.props.history.push('/user/dashboard');
    } else {
        this.setState({
            requestErrorMsg: 'User with this email already exists!'
        });
    }
}