package com.itvedant.dojolist.dao;

import com.itvedant.dojolist.entity.PasswordResetToken;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Transactional
public class ResetPasswordDAO {

    @PersistenceContext
    private EntityManager entityManager;

    // 🔹 Save Password Reset Token
    public void saveToken(PasswordResetToken token) {
        entityManager.persist(token);
    }

    // 🔹 Find Token by Token String
    public Optional<PasswordResetToken> findByToken(String token) {
        String query = "SELECT p FROM PasswordResetToken p WHERE p.token = :token";
        return entityManager.createQuery(query, PasswordResetToken.class)
                .setParameter("token", token)
                .getResultStream()
                .findFirst();
    }

    // 🔹 Delete Token by Email (Remove old tokens before generating new ones)
    public void deleteByEmail(String email) {
        String query = "DELETE FROM PasswordResetToken p WHERE p.email = :email";
        entityManager.createQuery(query)
                .setParameter("email", email)
                .executeUpdate();
    }

    // 🔹 Delete Specific Token (After Reset)
    public void deleteToken(PasswordResetToken token) {
        entityManager.remove(entityManager.contains(token) ? token : entityManager.merge(token));
    }
}
