package com.itvedant.dojolist.services;

import com.itvedant.dojolist.entity.User;
import com.itvedant.dojolist.repositories.UserRepository;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.mindrot.jbcrypt.BCrypt;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public String registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return "Error: Email is already in use!";
        }

        user.setPassword(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt()));
        userRepository.save(user);
        return "Registration successful!";
    }

    public String updateUser(Long id, User updatedUser) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Error: User not found."));

        existingUser.setName(updatedUser.getName());
        existingUser.setMobileNumber(updatedUser.getMobileNumber());

        if (updatedUser.getPassword() != null && !updatedUser.getPassword().trim().isEmpty()) {
            existingUser.setPassword(BCrypt.hashpw(updatedUser.getPassword(), BCrypt.gensalt()));
        }

        userRepository.save(existingUser);
        return "User updated successfully!";
    }

    @Transactional
    public void deleteUser(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            userRepository.deleteById(userId);
        } else {
            throw new IllegalArgumentException("Error: User not found.");
        }
    }

    public int getStreakForUser(Long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = optionalUser.get();
        LocalDate today = LocalDate.now();
        LocalDate lastCompleted = user.getLastCompletedDate();

        if (lastCompleted == null) {
            return 0;
        }

        if (lastCompleted.equals(today)) {
            return user.getStreakCount();
        } else if (lastCompleted.equals(today.minusDays(1))) {
            return user.getStreakCount();
        } else {
            return 0; // streak broken
        }
    }
    
    public User saveUser(User user) {
        return userRepository.save(user);
    }


}
