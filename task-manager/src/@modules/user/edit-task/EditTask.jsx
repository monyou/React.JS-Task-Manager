import React from 'react';
import './EditTask.scss';
import DBTaskManager from '../../../@shared/services/db-task-manager';
import TaskModel from '../../../@shared/models/task.model';

export default class UserEditTask extends React.Component {
    constructor(props) {
        super(props);
        this.dbTaskManager = new DBTaskManager();
        this.dbTaskManager.getById(this.props.location.state.taskId).then(
            result => {
                this.setState({
                    newTask: {
                        title: result.title,
                        content: result.content,
                        runTime: result.runTime,
                        status: result.status,
                        createdBy: result.createdBy
                    }
                });
            }
        );
        this.state = {
            newTask: {
                title: '',
                content: '',
                runTime: 0,
                status: '',
                createdBy: ''
            }
        }
        this.onInputChange = onInputChange.bind(this);
        this.editTask = editTask.bind(this);
    }

    render() {
        return (
            <div className="edit-task">
                <form className="edit-task-form" onSubmit={(e) => this.editTask(e)}>
                    <input type="text" name="title" placeholder="Title *" value={this.state.newTask.title} onChange={(e) => this.onInputChange(e.target)} required />
                    <textarea name="content" rows="5" placeholder="Content *" value={this.state.newTask.content} onChange={(e) => this.onInputChange(e.target)} required></textarea>
                    <input type="number" name="runTime" placeholder="Run time (hours) *" value={this.state.newTask.runTime} onChange={(e) => this.onInputChange(e.target)} required />
                    <input className="btn-edit-task" type="submit" value="Edit task" />
                </form>
            </div>
        );
    }
}

function onInputChange(e) {
    let value = e.value;
    let key = e.name;
    let newChanges = this.state.newTask;
    newChanges[key] = value;
    this.setState({
        newTask: newChanges
    });
}

async function editTask(e) {
    e.preventDefault();
    let title = this.state.newTask.title;
    let content = this.state.newTask.content;
    let runTime = this.state.newTask.runTime;
    let createdBy = this.state.newTask.createdBy;
    let status = this.state.newTask.status;

    let task = new TaskModel(
        title,
        content,
        runTime,
        createdBy,
        status
    );
    task.id = this.props.location.state.taskId;

    if (await this.dbTaskManager.edit(task)) {
        this.props.history.push('/user/dashboard');
    } else {
        alert('Task with this title already exists!');
    }
}