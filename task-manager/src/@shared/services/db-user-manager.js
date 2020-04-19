import UserModel from "../models/user.model";

export default class DBUserManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users'));
    }

    getByEmail(userEmail) {
        if (typeof (userEmail) === 'string') {
            let userFound = this.users.find(u => u.email === userEmail);
            if (userFound) {
                return userFound;
            } else {
                return null;
            }
        } else {
            alert('Wrong input types!');
        }
    }

    add(user) {
        if (user instanceof UserModel) {
            if (this.users.find(u => u.email === user.email)) {
                return false;
            } else {
                this.users.push(user);
                localStorage.setItem('users', JSON.stringify(this.users));
                return true;
            }
        } else {
            alert('Wrong input types!');
        }
    }

    edit(user) {
        if (user instanceof UserModel) {

        } else {
            alert('Wrong input types!');
        }
    }

    remove(userEmail) {
        if (typeof (userEmail) === 'string') {
            if (this.users.find(u => u.email === userEmail)) {
                this.users.splice(this.users.findIndex(u => u.email === userEmail), 1);
                localStorage.setItem('users', JSON.stringify(this.users));
                return true;
            } else {
                return false;
            }
        } else {
            alert('Wrong input types!');
        }
    }
}