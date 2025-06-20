package com.task_manager.app.repositroy;




import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.task_manager.app.beans.Task;
import com.task_manager.app.beans.User;

public interface TaskRepository extends JpaRepository<Task, Long> {

	List<Task> findByUser(User user);
}

