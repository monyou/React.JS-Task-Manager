import DBUserManager from './db-user-manager';
import UserModel from '../models/user.model';

export default class DBAuthManager {
    static login(userEmail, userPassword) {
        if (typeof (userEmail, userPassword) === 'string') {
            let dbUserManager = new DBUserManager();
            let user = dbUserManager.getByEmail(userEmail);
            if (user) {
                if (user.password === userPassword) {
                    return user.role;
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

    static register(user) {
        if (user instanceof UserModel) {
            let dbUserManager = new DBUserManager();
            if (dbUserManager.add(user)) {
                return true;
            } else {
                return false;
            }
        } else {
            alert('Wrong input types!');
        }
    }
}