package com.task_manager.app.repositroy;



import org.springframework.data.jpa.repository.JpaRepository;

import com.task_manager.app.beans.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email); 
}
