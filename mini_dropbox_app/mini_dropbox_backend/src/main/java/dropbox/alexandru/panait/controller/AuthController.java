package dropbox.alexandru.panait.controller;

import dropbox.alexandru.panait.model.User;
import dropbox.alexandru.panait.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // --- REGISTER ---
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        // Check if the username or email already exists
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists!");
        }

        // 2. Save the new user (using simple text for password for now)
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    // --- LOGIN ---
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginData) {
        // 1. Find the user by username
        Optional<User> userOptional = userRepository.findByUsername(loginData.getUsername());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // 2. Verify the password
            if (user.getPassword().equals(loginData.getPassword())) {
                // Return the User object (so we can get the ID in frontend)
                return ResponseEntity.ok(user);
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
    }
}