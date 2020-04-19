import React from 'react';
import './Layout.scss';
import { Switch, Route } from "react-router-dom";
import NotFound from '../not-found/NotFound';
import Home from '../../@modules/home/Home';
import Login from '../../@modules/auth/login/Login';
import Register from '../../@modules/auth/register/Register';
import DBAuthManager from '../services/db-auth-manager';
import { Dash as AdminDash } from '../../@modules/admin/dashboard/Dash';
import { Dash as UserDash } from '../../@modules/user/dashboard/Dash';

export default class Layout extends React.Component {
    constructor() {
        super();
        this.authManager = new DBAuthManager();
        this.menuOrHomeIcon = menuOrHomeIcon.bind(this);
        this.createLabelForTopbar = createLabelForTopbar.bind(this);
        this.toggleSidebar = toggleSidebar.bind(this);
        this.loadSidebarContent = loadSidebarContent.bind(this);
        this.logout = logout.bind(this);
        this.navigateToPage = navigateToPage.bind(this);
    }

    render() {
        this.authManager = new DBAuthManager();

        return (
            <div className="layout">
                <div className="topbar">
                    {this.menuOrHomeIcon()}
                    {this.createLabelForTopbar()}
                </div>
                <div className="sidebar">
                    {this.loadSidebarContent()}
                </div>
                <div className="content">
                    <Switch>
                        <Route path="/home" component={Home} />
                        <Route path="/auth/login" component={Login} />
                        <Route path="/auth/register" component={Register} />
                        <Route path="/admin/dashboard" component={AdminDash} />
                        <Route path="/user/dashboard" component={UserDash} />
                        <Route component={NotFound} />
                    </Switch>
                </div>
            </div>
        );
    }


}

function menuOrHomeIcon() {
    if (this.authManager.isLogged) {
        return <div className="action-icon" onClick={(e) => this.toggleSidebar(e)}><i className="fas fa-bars"></i></div>;
    } else {
        return <div className="action-icon" onClick={() => this.props.history.push('/home')}><i className="fas fa-home"></i></div>;
    }
}

function toggleSidebar(e) {
    let iconParent = e.target.parentNode;
    let sidebar = document.querySelector('.layout .sidebar');
    if (sidebar.style.width === '250px') {
        iconParent.innerHTML = '<i class="fas fa-bars"></i>';
        sidebar.style.display = 'none';
        sidebar.style.width = '0px';
    } else {
        iconParent.innerHTML = '<i class="fas fa-times"></i>';
        sidebar.style.display = 'block';
        sidebar.style.width = '250px';
    }
    if (!this.authManager.isLogged) {
        iconParent.innerHTML = '<i class="fas fa-home"></i>';
    }
}

function loadSidebarContent() {
    if (this.authManager.isAdmin()) {
        return (
            <div className='menu-items'>
                <div className="item" onClick={() => this.navigateToPage('/admin/dashboard')}>
                    <i className="fas fa-house-user"></i>
                    <span className='link'>Dashboard</span>
                </div>
                <div className="item" onClick={() => this.navigateToPage('/admin/dashboard')}>
                    <i className="fas fa-tasks"></i>
                    <span className='link'>Manage Tasks</span>
                </div>
                <div className="item" onClick={() => this.navigateToPage('/admin/dashboard')}>
                    <i className="fas fa-user-cog"></i>
                    <span className='link'>Manager Users</span>
                </div>
                <div className="item" onClick={() => this.logout()}>
                    <i className="fas fa-sign-out-alt"></i>
                    <span className='link'>Log Out</span>
                </div>
            </div>
        );
    } else {
        return (
            <div className='menu-items'>
                <div className="item" onClick={() => this.navigateToPage('/user/dashboard')}>
                    <i className="fas fa-house-user"></i>
                    <span className='link'>Dashboard</span>
                </div>
                <div className="item" onClick={() => this.logout()}>
                    <i className="fas fa-sign-out-alt"></i>
                    <span className='link'>Log Out</span>
                </div>
            </div>
        );
    }
}

function createLabelForTopbar() {
    let name = null;
    switch (this.props.location.pathname) {
        case '/home':
            if (this.authManager.isLogged) {
                name = "Menu"
            } else {
                name = 'Welcome';
            }
            break;
        case '/auth/login':
            name = 'Login';
            break;
        case '/auth/register':
            name = 'Register';
            break;
        case '/admin/dashboard':
            name = 'Dashboard';
            break;
        case '/user/dashboard':
            name = 'Dashboard';
            break;
        default:
            name = '';
            break;
    }
    return <div className="screen-label">{name}</div>;
}

function navigateToPage(route) {
    this.props.history.push(route);
    document.querySelector('.layout .topbar .action-icon i').click();
}

function logout() {
    this.authManager.logOut();
    this.props.history.replace('/home');
    document.querySelector('.layout .topbar .action-icon i').click();
}