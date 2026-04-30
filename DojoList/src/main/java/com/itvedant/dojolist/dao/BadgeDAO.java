package com.itvedant.dojolist.dao;

import com.itvedant.dojolist.entity.Badge;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class BadgeDAO {

    @PersistenceContext
    private EntityManager entityManager;

    // 🔹 Save a new Badge
    public void saveBadge(Badge badge) {
        entityManager.persist(badge);
    }

    // 🔹 Find a Badge by ID
    public Badge findBadgeById(Long badgeId) {
        return entityManager.find(Badge.class, badgeId);
    }

    // 🔹 Find all Badges for a given User ID
    public List<Badge> findBadgesByUserId(Long userId) {
        String query = "SELECT b FROM Badge b WHERE b.user.id = :userId";
        return entityManager.createQuery(query, Badge.class)
                .setParameter("userId", userId)
                .getResultList();
    }

    // 🔹 Update an existing Badge
    public void updateBadge(Badge badge) {
        entityManager.merge(badge);
    }

    // 🔹 Delete a Badge by ID
    public void deleteBadgeById(Long badgeId) {
        Badge badge = entityManager.find(Badge.class, badgeId);
        if (badge != null) {
            entityManager.remove(badge);
        }
    }
}

