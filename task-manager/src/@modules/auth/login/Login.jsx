import React from 'react';
import './Login.scss';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.emailRef = React.createRef();
        this.passRef = React.createRef();
    }

    render() {
        return (
            <div className="login">
                <img className="logo" src="/assets/images/logo512.png" alt="logo" />
                <form className="login-form" onSubmit={(e) => login(e, this)}>
                    <input type="email" name="email" placeholder="Email" ref={this.emailRef} />
                    <input type="password" name="password" placeholder="Password" ref={this.passRef} />
                    <input className="btn-login" type="submit" value="Login" />
                </form>
            </div>
        );
    }
}

function login(e, pageData) {
    e.preventDefault();
    let email = pageData.emailRef.current.value;
    let password = pageData.passRef.current.value;
}