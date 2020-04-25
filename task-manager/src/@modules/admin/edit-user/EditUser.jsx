import React from 'react';
import './EditUser.scss';
import UserModel from '../../../@shared/models/user.model';
import DBUserManager from '../../../@shared/services/db-user-manager';

export default class EditUser extends React.Component {
    constructor(props) {
        super(props);
        let dbUserManager = new DBUserManager();
        let user = dbUserManager.getByEmail(this.props.location.state.email);
        this.state = {
            newUser: {
                email: user.email,
                names: user.names,
                pass: '',
                repPass: '',
                isAdmin: user.role === 'admin' ? true : false,
            }
        };
        this.onInputChange = onInputChange.bind(this);
        this.editUser = editUser.bind(this);
    }

    render() {
        return (
            <div className="edit-user">
                <form className="edit-user-form" onSubmit={(e) => this.editUser(e)}>
                    <input type="text" name="names" placeholder="Names" value={this.state.newUser.names} onChange={(e) => this.onInputChange(e.target)} />
                    <input type="email" name="email" placeholder="Email *" value={this.state.newUser.email} onChange={(e) => this.onInputChange(e.target)} required />
                    <input type="password" name="pass" placeholder="New password" value={this.state.newUser.pass} onChange={(e) => this.onInputChange(e.target)} />
                    <input type="password" name="repPass" placeholder="Repeat new password" value={this.state.newUser.repPass} onChange={(e) => this.onInputChange(e.target)} />
                    <div className="checkbox">
                        <label htmlFor="isAdmin">Make the user admin?</label>
                        <input type="checkbox" name="isAdmin" checked={this.state.newUser.isAdmin} onChange={(e) => this.onInputChange(e.target)} />
                    </div>
                    <input className="btn-edit-user" type="submit" value="Edit user" />
                </form>
            </div>
        );
    }
}

function onInputChange(e) {
    let value = null;
    let key = e.name;
    if (e.type === 'checkbox') {
        value = e.checked;
    } else {
        value = e.value;
    }
    let newChanges = this.state.newUser;
    newChanges[key] = value;
    this.setState({
        newUser: newChanges
    });
}

function editUser(e) {
    e.preventDefault();
    let oldEmail = this.props.location.state.email;
    let newNames = this.state.newUser.names;
    let newEmail = this.state.newUser.email;
    let newPass = this.state.newUser.pass;
    let repNewPass = this.state.newUser.repPass;
    let newIsAdmin = this.state.newUser.isAdmin;

    if ((newPass || repNewPass) && newPass !== repNewPass) {
        alert('Passwords missmatch!');
        return;
    }

    let user = new UserModel(
        newEmail,
        newPass || null,
        newNames,
        newIsAdmin ? 'admin' : 'user'
    );

    if (oldEmail !== newEmail) {
        user.oldEmail = oldEmail;
    }

    let dbUserManager = new DBUserManager();
    if (dbUserManager.edit(user)) {
        this.props.history.push('/admin/manage-users');
    } else {
        alert('The user was NOT edited!');
    }
}