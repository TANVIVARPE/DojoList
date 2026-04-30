package com.itvedant.dojolist.controller;

import com.itvedant.dojolist.entity.ToDo;
import com.itvedant.dojolist.entity.User;
import com.itvedant.dojolist.services.ToDoService;
import com.itvedant.dojolist.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/todos")
public class ToDoController {

    @Autowired
    private ToDoService toDoService;

    @Autowired
    private UserService userService;

    @PostMapping("/user/{userId}")
    public ResponseEntity<?> addToDo(@RequestBody ToDo newToDo, @PathVariable Long userId) {
        Optional<User> userOptional = userService.getUserById(userId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        if (newToDo.getTask() == null || newToDo.getTask().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Task cannot be empty.");
        }

        newToDo.setUser(userOptional.get());
        newToDo.setCompleted(false);

        ToDo savedToDo = toDoService.addToDo(newToDo);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedToDo);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getTodosByUserId(@PathVariable Long userId) {
        List<ToDo> todos = toDoService.getTodosByUserId(userId);
        
        return ResponseEntity.ok(todos);
    }

    @PutMapping("/{todoId}")
    public ResponseEntity<?> updateTodo(@PathVariable Long todoId, @RequestBody ToDo updatedTodo) {
        try {
            ToDo updated = toDoService.updateToDo(todoId, updatedTodo);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/{todoId}")
    public ResponseEntity<String> deleteTodo(@PathVariable Long todoId) {
        toDoService.deleteToDoById(todoId);
        return ResponseEntity.ok("To-Do deleted successfully");
    }

    @PutMapping("/{todoId}/complete")
    public ResponseEntity<?> completeTodo(@PathVariable Long todoId) {
        Optional<ToDo> todoOptional = toDoService.getTodoById(todoId);

        if (todoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("To-Do not found");
        }

        ToDo todo = todoOptional.get();

        if (todo.isCompleted()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"To-Do is already completed.\"}");
        }

        // ✅ Mark the task as completed
        ToDo updatedTodo = toDoService.markToDoAsCompleted(todo);

        // ✅ Update tasksCompletedToday if completed today
        User user = updatedTodo.getUser();
        if (updatedTodo.getCreatedDate().equals(LocalDate.now())) {
            user.setTasksCompletedToday(user.getTasksCompletedToday() + 1);
            userService.saveUser(user); // Make sure UserService has a save method
        }

        return ResponseEntity.ok(updatedTodo);
    }


}
