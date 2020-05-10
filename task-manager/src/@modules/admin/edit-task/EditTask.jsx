import React from 'react';
import './EditTask.scss';
import DBTaskManager from '../../../@shared/services/db-task-manager';
import TaskModel from '../../../@shared/models/task.model';
import { connect } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';

class AdminEditTask extends React.Component {
    constructor(props) {
        super(props);
        this.dbTaskManager = new DBTaskManager();
        this.props.dispatch({
            type: 'TOGGLE_LOADING'
        });
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
                this.props.dispatch({
                    type: 'TOGGLE_LOADING'
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
            },
            requestErrorMsg: ''
        }
        this.editTask = editTask.bind(this);
    }

    render() {
        return (
            <div className="edit-task">
                <Formik
                    initialValues={{
                        title: this.state.newTask.title,
                        content: this.state.newTask.content,
                        runTime: this.state.newTask.runTime
                    }}
                    validate={
                        values => {
                            const errors = {};
                            if (!values.title) {
                                errors.title = 'Title is required';
                            }

                            if (!values.content) {
                                errors.content = 'Content is required';
                            }

                            if (!values.runTime) {
                                errors.runTime = 'Run time is required';
                            }

                            if (errors !== {}) {
                                this.setState({
                                    requestErrorMsg: ''
                                });
                            }
                            return errors;
                        }
                    }
                    onSubmit={(values) => {
                        this.editTask(values);
                    }}
                    enableReinitialize={true}
                >
                    {
                        () => (
                            <Form className="edit-task-form">
                                <div className="form-group">
                                    <Field type="text" name="title" placeholder="Title" />
                                    <ErrorMessage name="title" component="div" className="error-msg" />
                                </div>
                                <div className="form-group">
                                    <Field as="textarea" rows="5" name="content" placeholder="Content" />
                                    <ErrorMessage name="content" component="div" className="error-msg" />
                                </div>
                                <div className="form-group">
                                    <Field type="number" name="runTime" placeholder="Run time (hours)" />
                                    <ErrorMessage name="runTime" component="div" className="error-msg" />
                                    {this.state.requestErrorMsg !== '' ? <div className="error-msg">{this.state.requestErrorMsg}</div> : null}
                                </div>
                                <input className="btn-edit-task" type="submit" value="Edit task" />
                            </Form>
                        )
                    }
                </Formik>
            </div>
        );
    }
}

export default connect()(AdminEditTask);

async function editTask(values) {
    let title = values.title;
    let content = values.content;
    let runTime = values.runTime;
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
        this.props.history.push('/admin/manage-tasks');
    } else {
        this.setState({
            requestErrorMsg: 'The task was NOT edited!'
        });
    }
}