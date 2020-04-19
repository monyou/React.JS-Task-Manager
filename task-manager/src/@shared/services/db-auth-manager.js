import DBUserManager from './db-user-manager';
import UserModel from '../models/user.model';

export default class DBAuthManager {
    constructor() {
        this.isLogged = localStorage.getItem('isLogged') === 'true' ? true : false;
        let role = localStorage.getItem('loggedUserRole');
        switch (role) {
            case 'admin':
                this.loggedUserRole = 'admin';
                break;
            case 'user':
                this.loggedUserRole = 'user';
                break;
            default:
                this.loggedUserRole = null;
                break;
        }
    }

    logIn(userEmail, userPassword) {
        if (typeof (userEmail, userPassword) === 'string') {
            let dbUserManager = new DBUserManager();
            let user = dbUserManager.getByEmail(userEmail);
            if (user) {
                if (user.password === userPassword) {
                    this.isLogged = true;
                    this.loggedUserRole = user.role;
                    localStorage.setItem('isLogged', 'true');
                    localStorage.setItem('loggedUserRole', this.loggedUserRole);
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            alert('Wrong input types!');
        }
    }

    registerUser(user) {
        if (user instanceof UserModel) {
            let dbUserManager = new DBUserManager();
            if (dbUserManager.add(user)) {
                this.isLogged = true;
                this.loggedUserRole = user.role;
                localStorage.setItem('isLogged', 'true');
                localStorage.setItem('loggedUserRole', this.loggedUserRole);
                return true;
            } else {
                return false;
            }
        } else {
            alert('Wrong input types!');
        }
    }

    logOut() {
        this.isLogged = false;
        this.loggedUserRole = null;
        localStorage.removeItem('isLogged');
        localStorage.removeItem('loggedUserRole');
    }

    isAdmin() {
        if (this.loggedUserRole === 'admin') {
            return true;
        } else {
            return false;
        }
    }
}