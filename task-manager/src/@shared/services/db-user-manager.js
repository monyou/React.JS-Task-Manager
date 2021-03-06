import UserModel from "../models/user.model";
import firebase from './firebase';

export default class DBUserManager {
    constructor() {
        this.users = firebase.firestore().collection('users');
        this.tasks = firebase.firestore().collection('tasks');
    }

    async getStatistics() {
        return this.users.get().then(
            result => {
                let stats = [{
                        data: result.docs.filter(d => d.data().role === 'admin').length,
                        label: "admins"
                    },
                    {
                        data: result.docs.filter(d => d.data().role === 'user').length,
                        label: 'users'
                    }
                ];
                return stats;
            }
        );
    }

    async getByEmail(userEmail) {
        return this.users.where('email', '==', userEmail).get().then(
            result => {
                if (result.docs.length === 1) {
                    let user = result.docs[0].data();
                    let mappedUser = new UserModel(user.email, user.password, user.names, user.role);
                    mappedUser.id = result.docs[0].id;
                    return mappedUser;
                } else {
                    return null;
                }
            }
        );
    }

    async getAll() {
        return this.users.get().then(
            result => {
                let mappedUsers = result.docs.map(doc => new UserModel(doc.data().email, doc.data().password, doc.data().names, doc.data().role));
                return mappedUsers;
            }
        );
    }

    async add(user) {
        return this.getByEmail(user.email).then(
            result => {
                if (result) {
                    return false;
                } else {
                    this.users.add({
                        ...user
                    });
                    return true;
                }
            }
        );
    }

    async edit(user, oldEmail = null) {
        return this.getByEmail(oldEmail ? oldEmail : user.email).then(
            result => {
                if (result) {
                    if (user.password == null) {
                        user.password = result.password;
                    }
                    return this.users.doc(result.id).update({
                        ...user
                    });
                } else {
                    return false;
                }
            }
        ).then(
            result => {
                return true;
            }
        );
    }

    async remove(userEmail) {
        return this.getByEmail(userEmail).then(
            result => {
                if (result) {
                    this.users.doc(result.id).delete();
                    return this.tasks.where("createdBy", "==", result.id).get();
                } else {
                    return false;
                }
            }
        ).then(
            result => {
                if (result) {
                    result.docs.forEach(t => {
                        this.tasks.doc(t.id).delete();
                    });
                    return true;
                } else {
                    return false;
                }
            }
        );
    }
}