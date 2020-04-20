import React from 'react';
import './ManageUsers.scss';
import DBUserManager from '../../../@shared/services/db-user-manager';

export default class ManageUsers extends React.Component {
    constructor() {
        super();
        this.dbUserManager = new DBUserManager();
        this.state = {
            users: this.dbUserManager.getAll()
        };
        this.renderUsers = renderUsers.bind(this);
    }

    render() {
        return (
            <div className="manage-users">
                <div className="users-list">
                    {this.renderUsers()}
                </div>
            </div>
        );
    }
}

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
                    {u.names}
                </div>
                <div className="actions">
                    <div className="edit">
                        <i className="fas fa-user-edit"></i>
                        <span className='tooltip'>Edit user</span>
                    </div>
                    <div className="remove">
                        <i className="fas fa-user-times"></i>
                        <span className='tooltip'>Remove user</span>
                    </div>
                </div>
            </div>
        );
    });

    return users;
}