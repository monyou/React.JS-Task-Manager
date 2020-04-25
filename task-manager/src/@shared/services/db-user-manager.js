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
            return false;
        }
    }

    getAll() {
        return this.users;
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
            return false;
        }
    }

    edit(user) {
        if (user instanceof UserModel) {
            let foundUser = this.getByEmail(user.oldEmail ? user.oldEmail : user.email);
            if (user.password == null) {
                user.password = foundUser.password;
            }
            this.users.splice(this.users.findIndex(u => u === foundUser), 1, user);
            localStorage.setItem('users', JSON.stringify(this.users));
            return true;
        } else {
            return false;
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
            return false;
        }
    }

    static seedTableData() {
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([new UserModel('admin@admin.com', 'admin123', 'Main Admin', 'admin')]));
        }
    }
}