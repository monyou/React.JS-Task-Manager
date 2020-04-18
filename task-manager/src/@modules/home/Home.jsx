import React from 'react';
import './Home.scss';

export default class Home extends React.Component {
    render() {
        return (
            <div className="home">
                <img className="logo" src="/assets/images/logo512.png" alt="logo" />
                <button className="btn-login" onClick={() => this.props.history.push('/auth/login')}>Login</button>
                <button className="btn-register" onClick={() => this.props.history.push('/auth/register')}>Register</button>
            </div>
        );
    }
}