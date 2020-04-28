import DBUserManager from './db-user-manager';

export default class DBAuthManager {
    static async login(userEmail, userPassword) {
        let dbUserManager = new DBUserManager();
        let user = await dbUserManager.getByEmail(userEmail);
        if (user) {
            if (user.password === userPassword) {
                return user.role;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    static async register(user) {
        let dbUserManager = new DBUserManager();
        if (await dbUserManager.add(user)) {
            return true;
        } else {
            return false;
        }
    }
}