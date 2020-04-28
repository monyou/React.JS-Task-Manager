import React from 'react';
import './AddUser.scss';
import DBAuthManager from '../../../@shared/services/db-auth-manager';
import UserModel from '../../../@shared/models/user.model';

export default class AddUser extends React.Component {
    constructor() {
        super();
        this.namesRef = React.createRef();
        this.emailRef = React.createRef();
        this.passRef = React.createRef();
        this.repPassRef = React.createRef();
        this.isAdminRef = React.createRef();
        this.createUser = createUser.bind(this);
    }

    render() {
        return (
            <div className="add-user">
                <form className="create-user-form" onSubmit={(e) => this.createUser(e)}>
                    <input type="text" name="names" placeholder="Names *" ref={this.namesRef} required />
                    <input type="email" name="email" placeholder="Email *" ref={this.emailRef} required />
                    <input type="password" name="password" placeholder="Password *" ref={this.passRef} required />
                    <input type="password" name="rep-password" placeholder="Repeat password *" ref={this.repPassRef} required />
                    <div className="checkbox">
                        <label htmlFor="isAdmin">Make the user admin?</label>
                        <input type="checkbox" name="isAdmin" ref={this.isAdminRef} />
                    </div>
                    <input className="btn-create-user" type="submit" value="Add user" />
                </form>
            </div>
        );
    }
}

async function createUser(e) {
    e.preventDefault();
    let names = this.namesRef.current.value;
    let email = this.emailRef.current.value;
    let password = this.passRef.current.value;
    let repPassword = this.repPassRef.current.value;
    let isAdmin = this.isAdminRef.current.checked;

    if (password === repPassword) {
        let user = new UserModel(
            email,
            password,
            names,
            isAdmin ? 'admin' : 'user'
        );

        if (await DBAuthManager.register(user)) {
            this.props.history.push('/admin/manage-users');
        } else {
            alert('User with this email already exists!');
        }
    } else {
        alert('Password missmatch!');
    }
}