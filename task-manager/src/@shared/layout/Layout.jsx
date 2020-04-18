import React from 'react';
import './Layout.scss';
import { Switch, Route } from "react-router-dom";
import NotFound from '../not-found/NotFound';
import Home from '../../@modules/home/Home';
import Login from '../../@modules/auth/login/Login';
import Register from '../../@modules/auth/register/Register';

export default class Layout extends React.Component {
    render() {
        return (
            <div className="layout">
                <div className="topbar">
                    {menuOrHomeIcon(this.props)}
                    <div className="screen-label">{createLabelForTopbar(this.props.location.pathname)}</div>
                </div>
                <div className="sidebar">

                </div>
                <div className="content">
                    <Switch>
                        <Route path="/home" exact component={Home} />
                        <Route path="/auth/login" component={Login} />
                        <Route path="/auth/register" component={Register} />
                        <Route component={NotFound} />
                    </Switch>
                </div>
            </div>
        );
    }
}

function menuOrHomeIcon(props) {
    if (props.userLogged) {
        return (
            <div className='action-icon'><i className="fas fa-bars"></i></div>
        );
    } else {
        return <div className='action-icon' onClick={() => props.history.push('/home')}><i className="fas fa-home"></i></div>;
    }
}

function createLabelForTopbar(pathname) {
    switch (pathname) {
        case '/home':
            return 'Welcome';
        case '/auth/login':
            return 'Login';
        case '/auth/register':
            return 'Register';
        default:
            return '';
    }
}