import React from 'react';
import './AddTask.scss';
import DBTaskManager from '../../../@shared/services/db-task-manager';
import TaskModel from '../../../@shared/models/task.model';
import { connect } from 'react-redux';
import DBUserManager from '../../../@shared/services/db-user-manager';
import { Formik, Form, Field, ErrorMessage } from 'formik';

class UserAddTask extends React.Component {
    constructor() {
        super();
        this.state = {
            requestErrorMsg: ''
        };
        this.createTask = createTask.bind(this);
    }

    render() {
        return (
            <div className="add-task">
                <Formik
                    initialValues={{
                        title: '',
                        content: '',
                        runTime: ''
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
                        this.createTask(values);
                    }}
                >
                    {
                        () => (
                            <Form className="create-task-form">
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
                                <input className="btn-create-task" type="submit" value="Add task" />
                            </Form>
                        )
                    }
                </Formik>
            </div>
        );
    }
}

export default connect((state) => {
    return {
        loggedUser: state.loggedUser
    }
})(UserAddTask);

async function createTask(values) {
    let title = values.title;
    let content = values.content;
    let runTime = values.runTime;

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
        this.props.history.push('/user/dashboard');
    } else {
        this.setState({
            requestErrorMsg: 'Task with this title already exists!'
        });
    }
}