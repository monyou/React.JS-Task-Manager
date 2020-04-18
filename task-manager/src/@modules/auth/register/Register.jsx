import React from 'react';
import './Register.scss';

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.namesRef = React.createRef();
        this.emailRef = React.createRef();
        this.passRef = React.createRef();
        this.repPassRef = React.createRef();
    }

    render() {
        return (
            <div className="register">
                <img className="logo" src="/assets/images/logo512.png" alt="logo" />
                <form className="register-form" onSubmit={(e) => register(e, this)}>
                    <input type="text" name="names" placeholder="Names" ref={this.namesRef} />
                    <input type="email" name="email" placeholder="Email" ref={this.emailRef} />
                    <input type="password" name="password" placeholder="Password" ref={this.passRef} />
                    <input type="password" name="rep-password" placeholder="Repeat password" ref={this.repPassRef} />
                    <input className="btn-register" type="submit" value="Register" />
                </form>
            </div>
        );
    }
}

function register(e, pageData) {
    e.preventDefault();
    let names = pageData.namesRef.current.value;
    let email = pageData.emailRef.current.value;
    let password = pageData.passRef.current.value;
    let repPassword = pageData.repPassRef.current.value;
}