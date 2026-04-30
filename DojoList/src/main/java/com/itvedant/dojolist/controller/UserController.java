package com.itvedant.dojolist.controller;

import com.itvedant.dojolist.entity.User;
import com.itvedant.dojolist.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/email/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        Optional<User> userOptional = userService.getUserByEmail(email);
        
        // If user found, return OK with the user, otherwise return NOT_FOUND
        if (userOptional.isPresent()) {
            return ResponseEntity.ok(userOptional.get());  // Return user if found
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");  // Return NOT_FOUND with message if not found
        }
    }


    @GetMapping("/id/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok)  // If user found, return OK with the user
                .orElseThrow(() -> new RuntimeException("User not found"));  // If not found, throw error
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        String message = userService.updateUser(id, updatedUser);
        return ResponseEntity.ok(message);  // Return message after updating
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        try {
            userService.deleteUser(userId);  // This calls the void method
            return ResponseEntity.ok("User deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: Unable to delete user.");
        }
    }



    @GetMapping("/{userId}/streak")
    public ResponseEntity<?> getStreak(@PathVariable Long userId) {
        try {
            int streak = userService.getStreakForUser(userId);
            return ResponseEntity.ok(streak);  // Return streak count for the user
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");  // Handle case when user is not found
        }
    }
    
 // ✅ New endpoint for daily goal
    @GetMapping("/{userId}/dailyGoal")
    public ResponseEntity<?> getDailyGoal(@PathVariable Long userId) {
        Optional<User> userOptional = userService.getUserById(userId);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            Map<String, Integer> response = new HashMap<>();
            response.put("dailyGoal", user.getDailyGoal());  // from DB
            response.put("tasksCompletedToday", user.getTasksCompletedToday());  // from DB
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

}
