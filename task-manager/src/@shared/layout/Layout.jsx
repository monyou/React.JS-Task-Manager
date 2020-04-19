import React from 'react';
import './Layout.scss';
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import NotFound from '../not-found/NotFound';
import Home from '../../@modules/home/Home';
import Login from '../../@modules/auth/login/Login';
import Register from '../../@modules/auth/register/Register';
import { Dash as AdminDash } from '../../@modules/admin/dashboard/Dash';
import { Dash as UserDash } from '../../@modules/user/dashboard/Dash';
import ManageUsers from '../../@modules/admin/manage-users/ManageUsers';

class Layout extends React.Component {
    constructor() {
        super();
        this.menuOrHomeIcon = menuOrHomeIcon.bind(this);
        this.createLabelForTopbar = createLabelForTopbar.bind(this);
        this.toggleSidebar = toggleSidebar.bind(this);
        this.loadSidebarContent = loadSidebarContent.bind(this);
        this.logout = logout.bind(this);
        this.navigateToPage = navigateToPage.bind(this);
        this.addNewButton = addNewButton.bind(this);
    }

    render() {
        return (
            <div className="layout">
                <div className="topbar">
                    {this.menuOrHomeIcon()}
                    {this.createLabelForTopbar()}
                    {this.addNewButton()}
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
                        <Route path="/admin/manage-users" component={ManageUsers} />
                        <Route path="/user/dashboard" component={UserDash} />
                        <Route component={NotFound} />
                    </Switch>
                </div>
            </div>
        );
    }
}

export default connect((state) => {
    return {
        isLogged: state.isLogged,
        loggedUserRole: state.loggedUserRole,
        sidebarOpened: state.sidebarOpened
    }
})(Layout);

function menuOrHomeIcon() {
    if (this.props.isLogged && !this.props.sidebarOpened) {
        return <div className="action-icon" onClick={() => this.toggleSidebar()}><i className="fas fa-bars"></i></div>;
    } else if (this.props.isLogged && this.props.sidebarOpened) {
        return <div className="action-icon" onClick={() => this.toggleSidebar()}><i className="fas fa-times"></i></div>;
    } else {
        return <div className="action-icon" onClick={() => this.props.history.push('/home')}><i className="fas fa-home"></i></div>;
    }
}

function addNewButton() {
    if (this.props.isLogged && this.props.location.pathname === '/admin/manage-users') {
        return <div className="add-new-user-btn"><i className="fas fa-user-plus"></i></div>;
    }
}

function toggleSidebar() {
    this.props.dispatch({
        type: 'TOGGLE_SIDEBAR'
    });
    let sidebar = document.querySelector('.layout .sidebar');
    if (sidebar.style.width === '250px') {
        sidebar.style.display = 'none';
        sidebar.style.width = '0px';
    } else {
        sidebar.style.display = 'block';
        sidebar.style.width = '250px';
    }
}

function loadSidebarContent() {
    if (this.props.loggedUserRole === 'admin') {
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
                <div className="item" onClick={() => this.navigateToPage('/admin/manage-users')}>
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
            if (this.props.isLogged) {
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
        case '/admin/manage-users':
            name = 'Manage Users';
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
    this.props.dispatch({
        type: 'TOGGLE_SIDEBAR'
    });
    let sidebar = document.querySelector('.layout .sidebar');
    sidebar.style.display = 'none';
    sidebar.style.width = '0px';
    this.props.history.push(route);
}

function logout() {
    this.props.dispatch({
        type: 'LOGOUT_USER'
    });
    let sidebar = document.querySelector('.layout .sidebar');
    sidebar.style.display = 'none';
    sidebar.style.width = '0px';
    this.props.history.push('/home');
}