package com.itvedant.dojolist.services;

import com.itvedant.dojolist.entity.Badge;
import com.itvedant.dojolist.entity.User;
import com.itvedant.dojolist.repositories.BadgeRepository;
import com.itvedant.dojolist.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BadgeService {

    @Autowired
    private BadgeRepository badgeRepository;

    @Autowired
    private UserRepository userRepository;

    // 🔹 Assign a Badge to a User
    @Transactional
    public Badge assignBadge(Long userId, Badge badge) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        badge.setUser(user);
        return badgeRepository.save(badge);
    }

    // 🔹 Get all Badges for a User
    public List<Badge> getBadgesByUserId(Long userId) {
        return badgeRepository.findByUserId(userId);
    }

    // 🔹 Get a Badge by ID
    public Badge getBadgeById(Long id) {
        return badgeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Badge not found"));
    }

    // 🔹 Remove a Badge
    @Transactional
    public void removeBadge(Long id) {
        if (!badgeRepository.existsById(id)) {
            throw new IllegalArgumentException("Badge not found");
        }
        badgeRepository.deleteById(id);
    }
}

