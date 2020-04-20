import React from 'react';
import './Login.scss';
import { connect } from 'react-redux';
import DBAuthManager from '../../../@shared/services/db-auth-manager';

class Login extends React.Component {
    constructor() {
        super();
        this.emailRef = React.createRef();
        this.passRef = React.createRef();
        this.login = login.bind(this);
    }

    render() {
        return (
            <div className="login">
                <img className="logo" src="/assets/images/logo512.png" alt="logo" />
                <form className="login-form" onSubmit={(e) => this.login(e)}>
                    <input type="email" name="email" placeholder="Email" ref={this.emailRef} required />
                    <input type="password" name="password" placeholder="Password" ref={this.passRef} required />
                    <input className="btn-login" type="submit" value="Login" />
                </form>
            </div>
        );
    }
}

export default connect()(Login);

function login(e) {
    e.preventDefault();
    let email = this.emailRef.current.value;
    let password = this.passRef.current.value;

    let loggedUserRole = DBAuthManager.login(email, password);
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
        alert('No such user found with these credentials!');
    }
}