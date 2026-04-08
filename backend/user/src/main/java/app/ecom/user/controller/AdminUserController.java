package app.ecom.user.controller;

import app.ecom.user.entity.User;
import app.ecom.user.repository.UserRepository;

import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final UserRepository userRepository;

    public AdminUserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ✅ Get all users (with search)
    @GetMapping
    public Page<User> getUsers(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);

        if (!keyword.isEmpty()) {
            return userRepository.findByUsernameContainingIgnoreCase(keyword, pageable);
        }

        return userRepository.findAll(pageable);
    }

    // ✅ Enable/Disable user
    @PutMapping("/{id}/toggle")
    public void toggleUser(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow();
        user.setEnabled(!user.isEnabled());
        userRepository.save(user);
    }

    // ✅ Change role
    @PutMapping("/{id}/role")
    public void changeRole(@PathVariable Long id, @RequestParam String role) {
        User user = userRepository.findById(id).orElseThrow();
        user.setRole(role); // "user" or "admin"
        userRepository.save(user);
    }

    // ✅ Delete user
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }
}