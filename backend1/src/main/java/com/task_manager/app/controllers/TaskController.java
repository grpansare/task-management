package com.task_manager.app.controllers;




import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.task_manager.app.beans.Task;
import com.task_manager.app.services.TaskService;
import com.task_manager.app.utils.TaskStatusUpdateRequest;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping("/{userid}")
    public List<Task> getAllTasks(@PathVariable Long userid) {
        return taskService.getAllTasks(userid);
    }

//    @GetMapping("/{id}")
//    public Task getTaskById(@PathVariable Long id) {
//        return taskService.getTaskById(id);
//    }

    @PostMapping("/{email}")
    public Task createTask(@PathVariable String email, @RequestBody Task task) {
    	
    	System.out.println("Creatiing tasskinh");
        return taskService.createTask(task,email);
    }

    
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateTaskStatus(
            @PathVariable Long id,
            @RequestBody TaskStatusUpdateRequest request
            ) {
        
        try {
           
          
            
            // Update task status
            Task updatedTask = taskService.updateTaskStatus(id,  request.getCompleted());
            
            return ResponseEntity.ok(updatedTask);
        } 
      catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body( "An error occurred while updating task status");
        }
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task task) {
    	System.out.println(task.getPriority());
        return taskService.updateTask(id, task);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }
}
