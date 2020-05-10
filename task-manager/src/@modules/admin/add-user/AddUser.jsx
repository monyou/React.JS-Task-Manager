import React from 'react';
import './AddUser.scss';
import DBAuthManager from '../../../@shared/services/db-auth-manager';
import UserModel from '../../../@shared/models/user.model';
import { Formik, Form, Field, ErrorMessage } from 'formik';

export default class AddUser extends React.Component {
    constructor() {
        super();
        this.state = {
            requestErrorMsg: ''
        };
        this.createUser = createUser.bind(this);
    }

    render() {
        return (
            <div className="add-user">
                <Formik
                    initialValues={{
                        names: '',
                        email: '',
                        password: '',
                        repPassword: '',
                        isAdmin: false
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
                        this.createUser(values);
                    }}
                >
                    {
                        () => (
                            <Form className="create-user-form">
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
                                </div>
                                <div className="checkbox">
                                    <label htmlFor="isAdmin">Make the user admin?</label>
                                    <Field type="checkbox" name="isAdmin" />
                                </div>
                                {this.state.requestErrorMsg !== '' ? <div className="request-err">{this.state.requestErrorMsg}</div> : null}
                                <input className="btn-create-user" type="submit" value="Add user" />
                            </Form>
                        )
                    }
                </Formik>
            </div>
        );
    }
}

async function createUser(values) {
    let names = values.names;
    let email = values.email;
    let password = values.password;
    let isAdmin = values.isAdmin;

    let user = new UserModel(
        email,
        password,
        names,
        isAdmin ? 'admin' : 'user'
    );

    if (await DBAuthManager.register(user)) {
        this.props.history.push('/admin/manage-users');
    } else {
        this.setState({
            requestErrorMsg: 'User with this email already exists!'
        });
    }
}