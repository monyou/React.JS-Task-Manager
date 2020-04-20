import React from 'react';
import './Register.scss';
import DBAuthManager from '../../../@shared/services/db-auth-manager';
import UserModel from '../../../@shared/models/user.model';
import { connect } from 'react-redux';

class Register extends React.Component {
    constructor() {
        super();
        this.namesRef = React.createRef();
        this.emailRef = React.createRef();
        this.passRef = React.createRef();
        this.repPassRef = React.createRef();
        this.register = register.bind(this);
    }

    render() {
        return (
            <div className="register">
                <img className="logo" src="/assets/images/logo512.png" alt="logo" />
                <form className="register-form" onSubmit={(e) => this.register(e)}>
                    <input type="text" name="names" placeholder="Names *" ref={this.namesRef} required />
                    <input type="email" name="email" placeholder="Email *" ref={this.emailRef} required />
                    <input type="password" name="password" placeholder="Password *" ref={this.passRef} required />
                    <input type="password" name="rep-password" placeholder="Repeat password *" ref={this.repPassRef} required />
                    <input className="btn-register" type="submit" value="Register" />
                </form>
            </div>
        );
    }
}

export default connect()(Register);

function register(e) {
    e.preventDefault();
    let names = this.namesRef.current.value;
    let email = this.emailRef.current.value;
    let password = this.passRef.current.value;
    let repPassword = this.repPassRef.current.value;

    if (password === repPassword) {
        let user = new UserModel(
            email,
            password,
            names
        );

        if (DBAuthManager.register(user)) {
            this.props.dispatch({
                type: 'LOGIN_USER',
                userRole: 'user',
                userEmail: email
            });
            this.props.history.push('/user/dashboard');
        } else {
            alert('User with this email already exists!');
        }
    } else {
        alert('Password missmatch!');
    }
}