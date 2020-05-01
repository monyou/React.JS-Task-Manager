import React from 'react';
import './Layout.scss';
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import NotFound from '../not-found/NotFound';
import Home from '../../@modules/home/Home';
import Login from '../../@modules/auth/login/Login';
import Register from '../../@modules/auth/register/Register';
import ManageUsers from '../../@modules/admin/manage-users/ManageUsers';
import AddUser from '../../@modules/admin/add-user/AddUser';
import AdminDash from '../../@modules/admin/dashboard/Dash';
import UserDash from '../../@modules/user/dashboard/Dash';
import EditUser from '../../@modules/admin/edit-user/EditUser';
import AccessDenied from '../access-denied/AccessDenied';
import ManageTasks from '../../@modules/admin/manage-tasks/ManageTasks';
import AddTask from '../../@modules/admin/add-task/AddTask';

class Layout extends React.Component {
    constructor() {
        super();
        this.state = {
            sidebarOpened: false
        };
        this.loadProtectedPage = loadProtectedPage.bind(this);
        this.loadNotAuthPage = loadNotAuthPage.bind(this);
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
                <div className="sidebar-backdrop"></div>
                <div className="content">
                    <Switch>
                        <Route path="/home" render={(props) => this.loadNotAuthPage(props, Home)} />
                        <Route path="/auth/login" render={(props) => this.loadNotAuthPage(props, Login)} />
                        <Route path="/auth/register" render={(props) => this.loadNotAuthPage(props, Register)} />
                        <Route path="/admin/dashboard" render={(props) => this.loadProtectedPage(props, AdminDash, 'admin')} />
                        <Route path="/admin/manage-users" render={(props) => this.loadProtectedPage(props, ManageUsers, 'admin')} />
                        <Route path="/admin/add-user" render={(props) => this.loadProtectedPage(props, AddUser, 'admin')} />
                        <Route path="/admin/edit-user" render={(props) => this.loadProtectedPage(props, EditUser, 'admin')} />
                        <Route path="/admin/manage-tasks" render={(props) => this.loadProtectedPage(props, ManageTasks, 'admin')} />
                        <Route path="/admin/add-task" render={(props) => this.loadProtectedPage(props, AddTask, 'admin')} />
                        <Route path="/user/dashboard" render={(props) => this.loadProtectedPage(props, UserDash, 'user')} />
                        <Route path='/access-denied' component={AccessDenied} />
                        <Redirect exact from="/" to="/home" />
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
    }
})(Layout);

function loadProtectedPage(props, Component, role) {
    return (
        this.props.isLogged === true && this.props.loggedUserRole === role
            ? <Component {...props} />
            : <Redirect to='/access-denied' />
    );
}

function loadNotAuthPage(props, Component) {
    return (
        this.props.isLogged !== true
            ? <Component {...props} />
            : <Redirect to={`/${this.props.loggedUserRole}/dashboard`} />
    );
}

function menuOrHomeIcon() {
    if (this.props.isLogged && !this.state.sidebarOpened) {
        return <div className="action-icon" onClick={() => this.toggleSidebar()}><i className="fas fa-bars"></i></div>;
    } else if (this.props.isLogged && this.state.sidebarOpened) {
        return <div className="action-icon" onClick={() => this.toggleSidebar()}><i className="fas fa-times"></i></div>;
    } else {
        return <div className="action-icon" onClick={() => this.props.history.push('/home')}><i className="fas fa-home"></i></div>;
    }
}

function addNewButton() {
    if (this.props.isLogged) {
        if (this.props.location.pathname === '/admin/manage-users') {
            return (
                <div className="add-new-user-btn" onClick={() => this.props.history.push('/admin/add-user')}>
                    <i className="fas fa-user-plus"></i>
                    <span className='tooltip'>Create user</span>
                </div>
            );
        }
        if (this.props.location.pathname === '/admin/manage-tasks') {
            return (
                <div className="add-new-task-btn" onClick={() => this.props.history.push('/admin/add-task')}>
                    <i className="fas fa-plus-circle"></i>
                    <span className='tooltip'>Create task</span>
                </div>
            );
        }
        if (this.props.location.pathname === '/user/dashboard') {
            // TODO: change when user has method to add user
            // return <div className="add-new-user-btn" onClick={() => this.props.history.push('/admin/add-user')}><i className="fas fa-user-plus"></i></div>;
        }
    }
}

function toggleSidebar() {
    this.setState(state => ({
        sidebarOpened: !state.sidebarOpened
    }));
    let sidebar = document.querySelector('.layout .sidebar');
    let sidebarBackdrop = document.querySelector('.layout .sidebar-backdrop');
    if (sidebar.style.left === '0px') {
        sidebar.style.left = '-251px';
        sidebar.style.visibility = 'hidden';
        sidebarBackdrop.style.visibility = 'hidden';
    } else {
        sidebarBackdrop.style.visibility = 'visible';
        sidebar.style.visibility = 'visible';
        sidebar.style.left = '0px';
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
                <div className="item" onClick={() => this.navigateToPage('/admin/manage-tasks')}>
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
        case '/admin/add-user':
            name = 'Add User';
            break;
        case '/admin/edit-user':
            name = 'Edit User';
            break;
        case '/admin/manage-tasks':
            name = 'Manage Tasks';
            break;
        case '/admin/add-task':
            name = 'Add Task';
            break;
        case '/admin/edit-task':
            name = 'Edit Task';
            break;
        case '/user/dashboard':
            name = 'Dashboard';
            break;
        case '/access-denied':
            name = 'Access Denied'
            break;
        default:
            name = 'Not Found';
            break;
    }
    return <div className="screen-label">{name}</div>;
}

function navigateToPage(route) {
    this.setState(state => ({
        sidebarOpened: !state.sidebarOpened
    }));
    let sidebar = document.querySelector('.layout .sidebar');
    let sidebarBackdrop = document.querySelector('.layout .sidebar-backdrop');
    sidebar.style.left = '-251px';
    sidebar.style.visibility = 'hidden';
    sidebarBackdrop.style.visibility = 'hidden';
    this.props.history.push(route);
}

function logout() {
    this.setState(state => ({
        sidebarOpened: !state.sidebarOpened
    }));
    this.props.dispatch({
        type: 'LOGOUT_USER'
    });
    let sidebar = document.querySelector('.layout .sidebar');
    let sidebarBackdrop = document.querySelector('.layout .sidebar-backdrop');
    sidebar.style.left = '-251px';
    sidebar.style.visibility = 'hidden';
    sidebarBackdrop.style.visibility = 'hidden';
    this.props.history.push('/home');
}