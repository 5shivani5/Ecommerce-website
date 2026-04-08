package app.ecom.user.service;

import app.ecom.user.entity.User;
import app.ecom.user.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // 🔍 Get users (search + pagination)
    public Page<User> getUsers(String keyword, Pageable pageable) {
        if (keyword != null && !keyword.isEmpty()) {
            return userRepository.findByUsernameContainingIgnoreCase(keyword, pageable);
        }
        return userRepository.findAll(pageable);
    }

    // 🔄 Enable / Disable User
    public void toggleUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEnabled(!user.isEnabled());
        userRepository.save(user);
    }

    // 🔄 Change Role (user ↔ admin)
    public void changeRole(Long id, String role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔥 Normalize role to match DB (USER / ADMIN)
        role = role.toUpperCase();

        user.setRole(role);
        userRepository.save(user);
    }

    // ❌ Delete User
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }

    // 🧑 Register User (default role)
    public User registerUser(User user) {
        user.setRole("USER");         user.setEnabled(true);  // ✅ allow login
        return userRepository.save(user);
    }
}