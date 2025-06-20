package com.task_manager.app.utils;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
   
   

    private Long id; 
    private String username;
    
 
    private String email;

    private String token;

	

	

	
    
}
