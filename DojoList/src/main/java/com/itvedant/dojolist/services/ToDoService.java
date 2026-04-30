package com.itvedant.dojolist.services;

import com.itvedant.dojolist.entity.ToDo;
import com.itvedant.dojolist.entity.User;
import com.itvedant.dojolist.repositories.ToDoRepository;
import com.itvedant.dojolist.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ToDoService {

    @Autowired
    private ToDoRepository toDoRepository;

    @Autowired
    private UserRepository userRepository;

    public ToDo addToDo(ToDo toDo) {
        return toDoRepository.save(toDo);
    }

    public List<ToDo> getTodosByUserId(Long userId) {
        return toDoRepository.findByUserId(userId);
    }

    public Optional<ToDo> getTodoById(Long id) {
        return toDoRepository.findById(id);
    }

    public ToDo markToDoAsCompleted(ToDo todo) {
        if (!todo.isCompleted()) { // Only update streak if not already completed
            todo.setCompleted(true);
            updateUserStreak(todo.getUser());
        }
        return toDoRepository.save(todo);
    }


    public ToDo updateToDo(Long id, ToDo updatedToDo) {
        return toDoRepository.findById(id).map(todo -> {
            todo.setTask(updatedToDo.getTask());
            todo.setPriority(updatedToDo.getPriority());

            // Prevent re-updating completed status
            if (!todo.isCompleted() && updatedToDo.isCompleted()) {
                todo.setCompleted(true);
                updateUserStreak(todo.getUser());
            }

            return toDoRepository.save(todo);
        }).orElseThrow(() -> new RuntimeException("To-Do not found"));
    }

    private void updateUserStreak(User user) {
        LocalDate today = LocalDate.now();
        LocalDate lastCompletedDate = user.getLastCompletedDate();

        // If already updated today, don't increment again
        if (today.equals(lastCompletedDate)) {
            return; // already updated streak today
        }

        if (lastCompletedDate == null || lastCompletedDate.isBefore(today.minusDays(1))) {
            user.setStreakCount(1); // Reset streak if broken
        } else if (lastCompletedDate.equals(today.minusDays(1))) {
            user.setStreakCount(user.getStreakCount() + 1); // Continue streak
        }

        user.setLastCompletedDate(today);
        userRepository.save(user);
    }
    
    public void deleteToDoById(Long id) {
        toDoRepository.deleteById(id);
    }


}
