package com.task_manager.app.utils;
public class TaskStatusUpdateRequest {
    private Boolean completed;

    public TaskStatusUpdateRequest() {}

    public TaskStatusUpdateRequest(Boolean completed) {
        this.completed = completed;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }
}