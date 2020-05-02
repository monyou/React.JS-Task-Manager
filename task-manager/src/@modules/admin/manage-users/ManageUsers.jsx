import React from 'react';
import './ManageUsers.scss';
import { connect } from 'react-redux';
import DBUserManager from '../../../@shared/services/db-user-manager';
import YesNo from '../../../@shared/yes-no-dialog/YesNo';

class ManageUsers extends React.Component {
    constructor() {
        super();
        this.dbUserManager = new DBUserManager();
        this.dbUserManager.getAll().then(
            result => {
                this.setState({
                    users: result
                });
            }
        );
        this.state = {
            users: [],
            showRemoveUserDialog: false
        };
        this.renderUsers = renderUsers.bind(this);
        this.openRemoveUserDialog = openRemoveUserDialog.bind(this);
        this.closeRemoveUserDialog = closeRemoveUserDialog.bind(this);
        this.removeUser = removeUser.bind(this);
    }

    render() {
        return (
            <div className="manage-users">
                <div className="users-list">
                    {this.renderUsers()}
                    {this.state.showRemoveUserDialog ? <YesNo title={'Are you sure you want to remove this user?'} handleNo={this.closeRemoveUserDialog} handleYes={this.removeUser} /> : null}
                </div>
            </div>
        );
    }
}

export default connect((state) => {
    return {
        loggedUser: state.loggedUser
    }
})(ManageUsers);

function renderUsers() {
    let users = this.state.users.map((u, i) => {
        return (
            <div className="item" key={i}>
                <div className="status">
                    {
                        <>
                            {u.role === 'admin' ? <i className="fas fa-user-shield"></i> : <i className="fas fa-user"></i>}
                            <span className='tooltip'>{u.role === 'admin' ? 'Admin account' : 'User account'}</span>
                        </>
                    }
                </div>
                <div className="names">
                    {u.names || 'Unknown'}
                </div>
                <div className="actions">
                    <div className="edit" onClick={() => this.props.history.push('/admin/edit-user', { email: u.email })}>
                        <i className="fas fa-user-edit"></i>
                        <span className='tooltip'>Edit user</span>
                    </div>
                    {
                        this.props.loggedUser !== u.email ? <div className="remove" onClick={() => this.openRemoveUserDialog(u.email)}>
                            <i className="fas fa-user-times"></i>
                            <span className='tooltip'>Remove user</span>
                        </div> : null
                    }
                </div>
            </div>
        );
    });

    return users;
}

function openRemoveUserDialog(userEmail) {
    this.setState({
        showRemoveUserDialog: true,
        userToRemove: userEmail
    });
}

function closeRemoveUserDialog() {
    this.setState({
        showRemoveUserDialog: false,
        userToRemove: null
    });
}

async function removeUser() {
    let userRemoved = await this.dbUserManager.remove(this.state.userToRemove);
    if (userRemoved) {
        this.setState(state => ({
            users: state.users.filter(u => u.email !== state.userToRemove),
            showRemoveUserDialog: false,
            userToRemove: null
        }));
    } else {
        this.closeRemoveUserDialog();
    }
}