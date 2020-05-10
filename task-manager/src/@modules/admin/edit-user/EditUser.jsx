import React from 'react';
import './EditUser.scss';
import UserModel from '../../../@shared/models/user.model';
import DBUserManager from '../../../@shared/services/db-user-manager';
import { connect } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';

class EditUser extends React.Component {
    constructor(props) {
        super(props);
        let dbUserManager = new DBUserManager();
        this.props.dispatch({
            type: 'TOGGLE_LOADING'
        });
        dbUserManager.getByEmail(this.props.location.state.email).then(
            result => {
                this.setState({
                    newUser: {
                        email: result.email,
                        names: result.names,
                        pass: '',
                        repPass: '',
                        isAdmin: result.role === 'admin' ? true : false,
                    }
                });
                this.props.dispatch({
                    type: 'TOGGLE_LOADING'
                });
            }
        );
        this.state = {
            newUser: {
                email: '',
                names: '',
                pass: '',
                repPass: '',
                isAdmin: false,
            },
            requestErrorMsg: ''
        };
        this.editUser = editUser.bind(this);
    }

    render() {
        return (
            <div className="edit-user">
                <Formik
                    initialValues={{
                        names: this.state.newUser.names,
                        email: this.state.newUser.email,
                        password: '',
                        repPassword: '',
                        isAdmin: this.state.newUser.isAdmin
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

                            if (values.password && (values.password !== values.repPassword)) {
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
                        this.editUser(values);
                    }}
                    enableReinitialize={true}
                >
                    {
                        () => (
                            <Form className="edit-user-form">
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
                                <input className="btn-edit-user" type="submit" value="Edit user" />
                            </Form>
                        )
                    }
                </Formik>
            </div>
        );
    }
}

export default connect()(EditUser);

async function editUser(values) {
    let oldEmail = this.props.location.state.email;
    let newNames = values.names;
    let newEmail = values.email;
    let newPass = values.password;
    let newIsAdmin = values.isAdmin;

    let user = new UserModel(
        newEmail,
        newPass || null,
        newNames,
        newIsAdmin ? 'admin' : 'user'
    );

    let editEmail = oldEmail !== newEmail ? oldEmail : null;

    let dbUserManager = new DBUserManager();
    if (await dbUserManager.edit(user, editEmail)) {
        this.props.history.push('/admin/manage-users');
    } else {
        this.setState({
            requestErrorMsg: 'The user was NOT edited!'
        });
    }
}