package com.itvedant.dojolist.controller;

import com.itvedant.dojolist.dao.LoginRequest;
import com.itvedant.dojolist.dao.LoginResponse;
import com.itvedant.dojolist.dao.RegisterRequest;
import com.itvedant.dojolist.entity.PasswordResetToken;
import com.itvedant.dojolist.entity.User;
import com.itvedant.dojolist.repositories.PasswordResetTokenRepository;
import com.itvedant.dojolist.repositories.UserRepository;
import com.itvedant.dojolist.services.PasswordResetService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.mindrot.jbcrypt.BCrypt;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordResetService passwordResetService;
    
    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    
   

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        Optional<User> existingUser = userRepository.findByEmail(registerRequest.getEmail());

        if (existingUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Email already in use.");
        }

        // ✅ Properly hash the password before saving
        String hashedPassword = BCrypt.hashpw(registerRequest.getPassword(), BCrypt.gensalt());

        User newUser = new User();
        newUser.setName(registerRequest.getName());
        newUser.setEmail(registerRequest.getEmail());
        newUser.setMobileNumber(registerRequest.getMobileNumber());
        newUser.setPassword(hashedPassword); // 🔹 Store hashed password

        userRepository.save(newUser);

        return ResponseEntity.ok("User registered successfully!");
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: User not found.");
        }

        User user = userOpt.get();

        if (!BCrypt.checkpw(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: Incorrect password.");
        }

        // 🔥 Update lastLogin time on successful login
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        return ResponseEntity.ok(new LoginResponse(user.getId(), user.getName(), user.getEmail()));
    }
    
    @PostMapping("/password-reset/request")
    public ResponseEntity<Map<String, String>> requestReset(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        try {
            passwordResetService.sendResetToken(email);
            return ResponseEntity.ok(Map.of("message", "Password reset link sent to email."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    
 // 🔹 1. GET method: validate token
    @GetMapping("password-reset/confirm")
    public ResponseEntity<?> validateToken(@RequestParam("token") String token) {
        System.out.println("Received token for validation: " + token);

        // Check if token exists in the database
        Optional<PasswordResetToken> tokenOpt = passwordResetTokenRepository.findByToken(token);
        if (tokenOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid token: Token not found."));
        }

        PasswordResetToken resetToken = tokenOpt.get();

        // Check if token is expired
        if (resetToken.isExpired()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Expired token."));
        }

        return ResponseEntity.ok(Map.of("message", "Token is valid."));
    }

    // 🔹 2. POST method: reset password
    @PostMapping("password-reset/confirm")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");

        System.out.println("Received POST request to reset password with token: " + token);

        // Check if token exists in the database
        Optional<PasswordResetToken> tokenOpt = passwordResetTokenRepository.findByToken(token);
        if (tokenOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid token: Token not found."));
        }

        PasswordResetToken resetToken = tokenOpt.get();

        // Check if token is expired
        if (resetToken.isExpired()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Expired token."));
        }

        Optional<User> userOpt = userRepository.findByEmail(resetToken.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found."));
        }

        User user = userOpt.get();
        user.setPassword(BCrypt.hashpw(newPassword, BCrypt.gensalt()));  // Securely hash the new password
        userRepository.save(user);

        // Delete the reset token after use
        passwordResetTokenRepository.delete(resetToken);

        return ResponseEntity.ok(Map.of("message", "Password has been reset successfully."));
    }


}
