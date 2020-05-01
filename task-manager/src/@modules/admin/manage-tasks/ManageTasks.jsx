import React from 'react';
import './ManageTasks.scss';
import DBTaskManager from '../../../@shared/services/db-task-manager';
import YesNo from '../../../@shared/yes-no-dialog/YesNo';
import TaskStatus from '../../../@shared/task-status.enum';

export default class ManageTasks extends React.Component {
    constructor() {
        super();
        this.dbTaskManager = new DBTaskManager();
        this.dbTaskManager.getAll().then(
            result => {
                this.setState({
                    tasks: result
                });
            }
        );
        this.state = {
            tasks: [],
            showRemoveTaskDialog: false
        };
        this.renderTasks = renderTasks.bind(this);
        this.openRemoveTaskDialog = openRemoveTaskDialog.bind(this);
        this.closeRemoveTaskDialog = closeRemoveTaskDialog.bind(this);
        this.removeTask = removeTask.bind(this);
    }

    render() {
        return (
            <div className="manage-tasks">
                <div className="tasks-list">
                    {this.renderTasks()}
                    {this.state.showRemoveTaskDialog ? <YesNo title={'Are you sure you want to remove this task?'} handleNo={this.closeRemoveTaskDialog} handleYes={this.removeTask} /> : null}
                </div>
            </div>
        );
    }
}

function renderTasks() {
    let tasks = this.state.tasks.map((t, i) => {
        return (
            <div className="item" key={i}>
                <div className="status">
                    {showTaskStatus(t.status)}
                </div>
                <div className="title">
                    {t.title}
                </div>
                <div className="actions">
                    <div className="edit" onClick={() => this.props.history.push('/admin/edit-task', { taskId: t.id })}>
                        <i className="fas fa-edit"></i>
                        <span className='tooltip'>Edit task</span>
                    </div>
                    <div className="remove" onClick={() => this.openRemoveTaskDialog(t.id)}>
                        <i className="fas fa-trash"></i>
                        <span className='tooltip'>Remove task</span>
                    </div>
                </div>
            </div>
        );
    });

    return tasks;
}

function showTaskStatus(status) {
    switch (status) {
        case TaskStatus.Created:
            return (
                <>
                    <i className="fas fa-thumbtack" style={{ color: '#d4d117' }}></i>
                    <span className='tooltip'>Created</span>
                </>
            );
        case TaskStatus.InProgress:
            return (
                <>
                    <i className="fas fa-hammer" style={{ color: '#15aabf' }}></i>
                    <span className='tooltip'>In Progress</span>
                </>
            );
        case TaskStatus.Completed:
            return (
                <>
                    <i className="fas fa-thumbtack" style={{ color: '#a5e65a' }}></i>
                    <span className='tooltip'>Completed</span>
                </>
            );
        default:
            break;
    }
}

function openRemoveTaskDialog(taskId) {
    this.setState({
        showRemoveTaskDialog: true,
        taskToRemove: taskId
    });
}

function closeRemoveTaskDialog() {
    this.setState({
        showRemoveTaskDialog: false,
        taskToRemove: null
    });
}

async function removeTask() {
    let taskRemoved = await this.dbTaskManager.remove(this.state.taskToRemove);
    if (taskRemoved) {
        this.setState(state => ({
            tasks: state.tasks.filter(t => t.id !== this.state.taskToRemove),
            showRemoveTaskDialog: false,
            taskToRemove: null
        }));
    } else {
        this.closeRemoveTaskDialog();
    }
}