package com.itvedant.dojolist.services;

import com.itvedant.dojolist.entity.PasswordResetToken;
import com.itvedant.dojolist.entity.User;
import com.itvedant.dojolist.repositories.PasswordResetTokenRepository;
import com.itvedant.dojolist.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    private static final int EXPIRATION_MINUTES = 15;

    @Transactional
    public void sendResetToken(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("No user found with this email.");
        }

        tokenRepository.deleteByEmail(email);  // Clean old tokens

        String token = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(EXPIRATION_MINUTES);
        PasswordResetToken resetToken = new PasswordResetToken(token, email, expiryDate);
        tokenRepository.save(resetToken);

        String resetLink = "http://localhost:8080/auth/password-reset/confirm?token=" + token;
        String message = "Click the link below to reset your password: \n" + resetLink;
        emailService.sendEmail(email, "Password Reset Request", message);

        // ✅ Log for debugging
        System.out.println("[DEBUG] Password reset token generated: " + token);
        System.out.println("[DEBUG] Reset link: " + resetLink);
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        System.out.println("[DEBUG] Received token from frontend: " + token);
        System.out.println("[DEBUG] New password attempt: " + newPassword);

        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);
        if (tokenOpt.isEmpty()) {
            System.out.println("[DEBUG] Token not found in database.");
            throw new IllegalArgumentException("Invalid or expired token.");
        }

        PasswordResetToken resetToken = tokenOpt.get();
        if (resetToken.isExpired()) {
            System.out.println("[DEBUG] Token has expired. Expiry: " + resetToken.getExpiryDate());
            throw new IllegalArgumentException("Invalid or expired token.");
        }

        System.out.println("[DEBUG] Token is valid. Associated email: " + resetToken.getEmail());

        Optional<User> userOpt = userRepository.findByEmail(resetToken.getEmail());
        if (userOpt.isEmpty()) {
            System.out.println("[DEBUG] User not found for email: " + resetToken.getEmail());
            throw new IllegalArgumentException("User not found.");
        }

        User user = userOpt.get();
        user.setPassword(BCrypt.hashpw(newPassword, BCrypt.gensalt()));
        userRepository.save(user);

        // Clean up used token
        tokenRepository.delete(resetToken);
        System.out.println("[DEBUG] Password reset successful for user: " + user.getEmail());
    }
}
