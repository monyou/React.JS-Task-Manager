import TaskModel from "../models/task.model";
import firebase from './firebase';

export default class DBTaskManager {
    constructor() {
        this.tasks = firebase.firestore().collection('tasks');
    }

    async getById(taskId) {
        return this.tasks.doc(taskId).get().then(
            result => {
                if (result) {
                    let mappedTask = new TaskModel(result.data().title, result.data().content, result.data().runTime, result.data().createdBy, result.data().status, result.data().createdOn);
                    mappedTask.id = result.id;
                    return mappedTask;
                } else {
                    return null;
                }
            }
        );
    }

    async getByTitle(title) {
        return this.tasks.where('title', '==', title).get().then(
            result => {
                if (result.docs.length === 1) {
                    let mappedTask = new TaskModel(result.docs[0].data().title, result.docs[0].data().content, result.docs[0].data().runTime, result.docs[0].data().createdBy, result.docs[0].data().status, result.docs[0].data().createdOn);
                    mappedTask.id = result.id;
                    return mappedTask;
                } else {
                    return null;
                }
            }
        );
    }

    async getAll() {
        return this.tasks.get().then(
            result => {
                let mappedTasks = [];
                result.docs.forEach(doc => {
                    let map = new TaskModel(doc.data().title, doc.data().content, doc.data().runTime, doc.data().createdBy, doc.data().status, doc.data().createdOn);
                    map.id = doc.id;
                    mappedTasks.push(map);
                });
                return mappedTasks;
            }
        );
    }

    async add(task) {
        return this.getByTitle(task.title).then(
            result => {
                if (result) {
                    return false;
                } else {
                    this.tasks.add({
                        ...task
                    });
                    return true;
                }
            }
        );
    }

    async edit(task) {
        return this.getById(task.id).then(
            result => {
                if (result) {
                    task.createdOn = result.createdOn;
                    return this.tasks.doc(result.id).update({
                        ...task
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

    async remove(taskId) {
        return this.getById(taskId).then(
            result => {
                if (result) {
                    this.tasks.doc(result.id).delete();
                    return true;
                } else {
                    return false;
                }
            }
        );
    }
}