package com.itvedant.dojolist.dao;

import com.itvedant.dojolist.entity.ToDo;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import java.util.List;

@Transactional
public class ToDoDAO {

    @PersistenceContext
    private EntityManager entityManager;

    // 🔹 Save To-Do
    public void saveTodo(ToDo todo) {
        entityManager.persist(todo);
    }

    // 🔹 Find To-Dos by User ID
    public List<ToDo> findTodosByUserId(Long userId) {
        String query = "SELECT t FROM ToDo t WHERE t.user.id = :userId"; // ✅ Correct entity name
        return entityManager.createQuery(query, ToDo.class)
                .setParameter("userId", userId)
                .getResultList();
    }

    // 🔹 Update To-Do
    public void updateTodo(ToDo todo) {
        entityManager.merge(todo);
    }

    // 🔹 Delete To-Do
    public void deleteTodoById(Long id) {
        ToDo todo = entityManager.find(ToDo.class, id);
        if (todo != null) {
            entityManager.remove(todo);
        }
    }
    
    public List<ToDo> findPendingTodosByUserId(Long userId) {
        String query = "SELECT t FROM ToDo t WHERE t.user.id = :userId AND t.completed = false";
        return entityManager.createQuery(query, ToDo.class)
                .setParameter("userId", userId)
                .getResultList();
    }

   

}
