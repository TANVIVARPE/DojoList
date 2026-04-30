package com.itvedant.dojolist.dao;

import com.itvedant.dojolist.entity.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Transactional
public class UserDAO {

    @PersistenceContext
    private EntityManager entityManager;

    // 🔹 Save User
    public void saveUser(User user) {
        entityManager.persist(user);
    }

    // 🔹 Find User by Email
    public Optional<User> findByEmail(String email) {
        String query = "SELECT u FROM User u WHERE u.email = :email";
        List<User> users = entityManager.createQuery(query, User.class)
                .setParameter("email", email)
                .getResultList();
        return users.stream().findFirst();
    }

    // 🔹 Update User
    public void updateUser(User user) {
        entityManager.merge(user);
    }

    // 🔹 Delete User
    public void deleteUser(Long id) {
        User user = entityManager.find(User.class, id);
        if (user != null) {
            entityManager.remove(user);
        }
    }
}
