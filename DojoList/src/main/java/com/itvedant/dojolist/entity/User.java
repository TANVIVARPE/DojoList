package com.itvedant.dojolist.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Password is required")
    @JsonIgnore
    private String password;

    @Pattern(regexp = "^\\d{10}$", message = "Invalid mobile number")
    @Column(nullable = false)
    private String mobileNumber;

    @Column(nullable = false, columnDefinition = "integer default 0")
    private int streakCount = 0;

    @Column(name = "last_completed_date")
    private LocalDate lastCompletedDate;  // ✅ Added for streak tracking

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Badge> badges = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ToDo> todos = new ArrayList<>();
    
    @Column(name = "last_login_date", nullable = true)  // Ensure correct column mapping
    private LocalDateTime lastLogin;
    
    @Column(name = "daily_goal", nullable = false)
    private int dailyGoal = 3; // Default goal is 3 tasks per day

    @Column(name = "tasks_completed_today", nullable = false)
    private int tasksCompletedToday = 0;



    public User() {}

    public User(String email, String name, String password, String mobileNumber) {
        this.email = email;
        this.name = name;
        this.password = password;
        this.mobileNumber = mobileNumber;
        this.streakCount = 0;
        this.lastCompletedDate = null; 
        this.lastLogin = null;// Initially null
    }

    // Getters and Setters
    
    

    public LocalDateTime getLastLogin() {
		return lastLogin;
	}

	public void setLastLogin(LocalDateTime lastLogin) {
		this.lastLogin = lastLogin;
	}

	public int getStreakCount() { return streakCount; }
    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getMobileNumber() {
		return mobileNumber;
	}

	public void setMobileNumber(String mobileNumber) {
		this.mobileNumber = mobileNumber;
	}

	public List<Badge> getBadges() {
		return badges;
	}

	public void setBadges(List<Badge> badges) {
		this.badges = badges;
	}

	public List<ToDo> getTodos() {
		return todos;
	}

	public void setTodos(List<ToDo> todos) {
		this.todos = todos;
	}	
	

	public int getDailyGoal() {
		return dailyGoal;
	}

	public void setDailyGoal(int dailyGoal) {
		this.dailyGoal = dailyGoal;
	}

	public int getTasksCompletedToday() {
		return tasksCompletedToday;
	}

	public void setTasksCompletedToday(int tasksCompletedToday) {
		this.tasksCompletedToday = tasksCompletedToday;
	}

	@Override
	public String toString() {
		return "User [id=" + id + ", email=" + email + ", name=" + name + ", password=" + password + ", mobileNumber="
				+ mobileNumber + ", streakCount=" + streakCount + ", lastCompletedDate=" + lastCompletedDate
				+ ", badges=" + badges + ", todos=" + todos + ", lastLogin=" + lastLogin + ", getLastLogin()="
				+ getLastLogin() + ", getStreakCount()=" + getStreakCount() + ", getId()=" + getId() + ", getEmail()="
				+ getEmail() + ", getName()=" + getName() + ", getPassword()=" + getPassword() + ", getMobileNumber()="
				+ getMobileNumber() + ", getBadges()=" + getBadges() + ", getTodos()=" + getTodos()
				+ ", getLastCompletedDate()=" + getLastCompletedDate() + ", getClass()=" + getClass() + ", hashCode()="
				+ hashCode() + ", toString()=" + super.toString() + "]";
	}

	public void setStreakCount(int streakCount) { this.streakCount = streakCount; }

    public LocalDate getLastCompletedDate() { return lastCompletedDate; }
    public void setLastCompletedDate(LocalDate lastCompletedDate) { this.lastCompletedDate = lastCompletedDate; }

}
