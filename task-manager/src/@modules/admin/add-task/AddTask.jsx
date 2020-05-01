import React from 'react';
import './AddTask.scss';
import DBTaskManager from '../../../@shared/services/db-task-manager';
import TaskModel from '../../../@shared/models/task.model';
import { connect } from 'react-redux';
import DBUserManager from '../../../@shared/services/db-user-manager';

class AddTask extends React.Component {
    constructor() {
        super();
        this.titleRef = React.createRef();
        this.contentRef = React.createRef();
        this.runTimeRef = React.createRef();
        this.createTask = createTask.bind(this);
    }

    render() {
        return (
            <div className="add-task">
                <form className="create-task-form" onSubmit={(e) => this.createTask(e)}>
                    <input type="text" name="title" placeholder="Title *" ref={this.titleRef} required />
                    <textarea name="content" rows="5" placeholder="Content *" ref={this.contentRef} required></textarea>
                    <input type="number" name="runtime" placeholder="Run time (hours) *" ref={this.runTimeRef} required />
                    <input className="btn-create-task" type="submit" value="Add task" />
                </form>
            </div>
        );
    }
}

export default connect((state) => {
    return {
        loggedUser: state.loggedUser
    }
})(AddTask);

async function createTask(e) {
    e.preventDefault();
    let title = this.titleRef.current.value;
    let content = this.contentRef.current.value;
    let runTime = this.runTimeRef.current.value;

    let dbUserManager = new DBUserManager();
    let currentUser = await dbUserManager.getByEmail(this.props.loggedUser);
    
    let task = new TaskModel(
        title,
        content,
        runTime,
        currentUser.id
    );

    let dbTaskManager = new DBTaskManager();
    if (await dbTaskManager.add(task)) {
        this.props.history.push('/admin/manage-tasks');
    } else {
        alert('Task with this title already exists!');
    }
}