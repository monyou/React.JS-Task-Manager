import React from 'react';
import './Dash.scss';
import DBTaskManager from '../../../@shared/services/db-task-manager';
import DBUserManager from '../../../@shared/services/db-user-manager';

export default class AdminDash extends React.Component {
    constructor() {
        super();
        this.dbTaskManager = new DBTaskManager();
        this.dbUserManager = new DBUserManager();
        this.dbTaskManager.getStatistics().then(
            result => {
                this.setState({
                    tasksStat: result
                })
            }
        );
        this.dbUserManager.getStatistics().then(
            result => {
                this.setState({
                    usersStat: result
                })
            }
        );
        this.state = {
            usersStat: [],
            tasksStat: [],
        };
        this.renderUsersStatistics = renderUsersStatistics.bind(this);
        this.renderTasksStatistics = renderTasksStatistics.bind(this);
    }

    render() {
        return (
            <div className="admin-dash">
                <div className="group-label">
                    <span className="label">Users info</span>
                    <div className="hr"></div>
                </div>
                <div className="users-wrapper">
                    {this.renderUsersStatistics()}
                </div>
                <div className="group-label">
                    <span className="label">Tasks info</span>
                    <div className="hr"></div>
                </div>
                <div className="tasks-wrapper">
                    {this.renderTasksStatistics()}
                </div>
            </div>
        );
    }
}

function renderUsersStatistics() {
    let usersStat = this.state.usersStat.map((us, i) => {
        return (
            <div className="tile" key={i} onClick={() => this.props.history.push('/admin/manage-users')}>
                <span className="data">{us.data}</span>
                <span className="label">{us.label}</span>
            </div>
        );
    });

    return usersStat;
}

function renderTasksStatistics() {
    let tasksStat = this.state.tasksStat.map((ts, i) => {
        return (
            <div className="tile" key={i} onClick={() => this.props.history.push('/admin/manage-tasks')}>
                <span className="data">{ts.data}</span>
                <span className="label">{ts.label}</span>
            </div>
        );
    });

    return tasksStat;
}