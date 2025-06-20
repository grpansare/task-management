package com.task_manager.app.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.task_manager.app.beans.Task;
import com.task_manager.app.beans.User;
import com.task_manager.app.repositroy.TaskRepository;
import com.task_manager.app.repositroy.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    
    @Autowired
    private UserRepository userRepo;
    public List<Task> getAllTasks(Long userid) {
    	User user=userRepo.findById(userid).get();
        return taskRepository.findByUser(user);
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id).orElse(null);
    }

    public Task createTask(Task task,String email) {
    	  System.out.println("cretign task");
    	User user=userRepo.findByEmail(email).get();
//    	user.getTasks().add(task);
//    	userRepo.save(user);
    	task.setUser(user);
        return taskRepository.save(task);
    }
    
    public Task updateTaskStatus(Long taskId,  Boolean completed) throws Exception {
        // Find the task
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new Exception("Task not found with id: " + taskId));

        

        // Update the status
        task.setCompleted(completed);
        
        // If task is being marked as completed, set completion date
        if (completed) {
            task.setCompletedAt(LocalDateTime.now());
        } else {
            task.setCompletedAt(null);
        }

        // Save and return updated task
        return task;
    }

    public Task updateTask(Long id, Task updatedTask) {
        Task task = getTaskById(id);
        if (task != null) {
            task.setTitle(updatedTask.getTitle());
            task.setDescription(updatedTask.getDescription());
            task.setDueDate(updatedTask.getDueDate());
            task.setCompleted(updatedTask.isCompleted());
            task.setPriority(updatedTask.getPriority());
            return taskRepository.save(task);
        }
        return null;
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}
