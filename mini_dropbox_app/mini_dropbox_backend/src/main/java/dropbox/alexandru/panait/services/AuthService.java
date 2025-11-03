package com.dropbox.alexandru.panait.service;

import com.minidropbox.model.User;
import com.minidropbox.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public boolean authenticate(String usernameOrEmail, String password) {
        Optional<User> user = userRepository.findByUsername(usernameOrEmail);
        if (user.isEmpty()) {
            user = userRepository.findByEmail(usernameOrEmail);
        }
        return user.isPresent() && user.get().getPassword().equals(password);
    }
}
