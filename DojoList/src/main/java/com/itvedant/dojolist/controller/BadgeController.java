package com.itvedant.dojolist.controller;

import com.itvedant.dojolist.entity.Badge;
import com.itvedant.dojolist.services.BadgeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/badges")
public class BadgeController {

    @Autowired
    private BadgeService badgeService;

    // 🔹 Assign a Badge to a User
    @PostMapping("/{userId}")
    public ResponseEntity<Badge> assignBadge(@PathVariable Long userId, @RequestBody Badge badge) {
        Badge assignedBadge = badgeService.assignBadge(userId, badge);
        return ResponseEntity.ok(assignedBadge);
    }

    // 🔹 Get Badges for a User
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Badge>> getUserBadges(@PathVariable Long userId) {
        List<Badge> badges = badgeService.getBadgesByUserId(userId);
        return ResponseEntity.ok(badges);
    }

    // 🔹 Get a Badge by ID
    @GetMapping("/{id}")
    public ResponseEntity<Badge> getBadgeById(@PathVariable Long id) {
        Badge badge = badgeService.getBadgeById(id);
        return ResponseEntity.ok(badge);
    }

    // 🔹 Remove a Badge
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeBadge(@PathVariable Long id) {
        badgeService.removeBadge(id);
        return ResponseEntity.noContent().build();
    }
}

