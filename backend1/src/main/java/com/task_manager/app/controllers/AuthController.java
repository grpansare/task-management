package com.task_manager.app.controllers;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.task_manager.app.beans.User;
import com.task_manager.app.repositroy.UserRepository;
import com.task_manager.app.security.JwtUtil;
import com.task_manager.app.utils.AuthResponse;

import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder encoder;

    @PostMapping("/register")
    public ResponseEntity<?> signup(@RequestBody User user) {
    	try {
    		 user.setPassword(encoder.encode(user.getPassword()));
    	        userRepo.save(user);
    	        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    	}catch(Exception e) {
    		return new ResponseEntity<>("Internal server error",HttpStatus.INTERNAL_SERVER_ERROR);
    	}
       
    
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginReq) {
        try {
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginReq.getEmail(), loginReq.getPassword()));

            if (auth.isAuthenticated()) {
                User user = userRepo.findByEmail(loginReq.getEmail()).orElse(null);
                if (user == null) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body("User not found");
                }

                String token = jwtUtil.generateToken(user.getEmail());

                AuthResponse authResponse = new AuthResponse(user.getId(),user.getUsername(), user.getEmail(), token);
                return ResponseEntity.ok(authResponse);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Login failed");
    }


}
