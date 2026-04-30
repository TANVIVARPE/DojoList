package com.itvedant.dojolist.repositories;

import com.itvedant.dojolist.entity.Badge;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BadgeRepository extends JpaRepository<Badge, Long> {

    // 🔹 Find all Badges assigned to a specific User
    List<Badge> findByUserId(Long userId);
}

