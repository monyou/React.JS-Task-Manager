import TaskStatus from '../task-status.enum';

export default class TaskModel {
    constructor(
        title,
        content,
        runTime,
        createdBy,
        status = TaskStatus.Created,
        createdOn = new Date()
    ) {
        this.title = title;
        this.content = content;
        this.runTime = runTime;
        this.createdBy = createdBy;
        this.status = status;
        this.createdOn = createdOn;
    }
}