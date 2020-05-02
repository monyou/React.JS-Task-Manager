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
            taskToChangeStatus: null,
            showRemoveTaskDialog: false
        };
        this.renderTasks = renderTasks.bind(this);
        this.openRemoveTaskDialog = openRemoveTaskDialog.bind(this);
        this.closeRemoveTaskDialog = closeRemoveTaskDialog.bind(this);
        this.openChangeTaskStatusDropdown = openChangeTaskStatusDropdown.bind(this);
        this.closeChangeTaskStatusDropdown = closeChangeTaskStatusDropdown.bind(this);
        this.changeTaskStatus = changeTaskStatus.bind(this);
        this.removeTask = removeTask.bind(this);
    }

    render() {
        return (
            <div className="manage-tasks">
                <div className="tasks-list">
                    {this.renderTasks()}
                    <div className="statusesDropdown">
                        <div className="status-created" onClick={() => this.changeTaskStatus(TaskStatus.Created)}>
                            <span className="label">Created</span>
                            <i className="fas fa-thumbtack"></i>
                        </div>
                        <div className="status-inprogress" onClick={() => this.changeTaskStatus(TaskStatus.InProgress)}>
                            <span className="label">In progress</span>
                            <i className="fas fa-hammer"></i>
                        </div>
                        <div className="status-completed" onClick={() => this.changeTaskStatus(TaskStatus.Completed)}>
                            <span className="label">Completed</span>
                            <i className="fas fa-clipboard-check"></i>
                        </div>
                    </div>
                    <div className="dropdownOverlay" onClick={() => this.closeChangeTaskStatusDropdown()}></div>
                    {this.state.showRemoveTaskDialog ? <YesNo title={'Are you sure you want to remove this task?'} handleNo={this.closeRemoveTaskDialog} handleYes={this.removeTask} /> : null}
                </div>
            </div>
        );
    }
}

function renderTasks() {
    let tasks = this.state.tasks.map((t, i) => {
        return (
            <div className="item" key={i} data-index={i + 1}>
                <div className="status" onClick={(e) => this.openChangeTaskStatusDropdown(e, t)}>
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

function openChangeTaskStatusDropdown(e, t) {
    let item = e.target.parentNode.parentNode;
    let statusesDropdown = document.querySelector('.statusesDropdown');
    let dropdownOverlay = document.querySelector('.dropdownOverlay');

    statusesDropdown.style.top = `${(item.getAttribute('data-index') * item.scrollHeight) - 15}px`;
    statusesDropdown.style.display = 'flex';
    dropdownOverlay.style.display = 'block';

    this.setState({
        taskToChangeStatus: t
    });
}

function closeChangeTaskStatusDropdown() {
    let statusesDropdown = document.querySelector('.statusesDropdown');
    let dropdownOverlay = document.querySelector('.dropdownOverlay');
    statusesDropdown.style.display = 'none';
    dropdownOverlay.style.display = 'none';

    this.setState({
        taskToChangeStatus: null
    });
}

async function changeTaskStatus(status) {
    let currentStatus = this.state.taskToChangeStatus.status;
    if (status === currentStatus) {
        this.closeChangeTaskStatusDropdown();
    } else {
        let newTask = this.state.taskToChangeStatus;
        newTask.status = status;
        let newTasks = this.state.tasks;
        newTasks[newTasks.findIndex(t => t.id === newTask.id)].status = status;

        if (await this.dbTaskManager.edit(newTask)) {
            this.setState({
                tasks: newTasks
            });
            this.closeChangeTaskStatusDropdown();
        } else {
            alert('Status was not changed!');
        }
    }
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
                    <i className="fas fa-clipboard-check" style={{ color: '#a5e65a' }}></i>
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
            tasks: state.tasks.filter(t => t.id !== state.taskToRemove),
            showRemoveTaskDialog: false,
            taskToRemove: null
        }));
    } else {
        this.closeRemoveTaskDialog();
    }
}