package dropbox.alexandru.panait.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController; // <--- IMPORT NOU

import dropbox.alexandru.panait.repository.UserRepository;
import dropbox.alexandru.panait.model.User;

@RestController
@RequestMapping("/test")
public class UserController {

    @Autowired
    private UserRepository repo;

    @GetMapping("/add")
    public String add() {

        User u = new User();
        u.setUsername("alex");
        u.setEmail("alex@test.com");
        u.setPassword("parola123");

        User savedUser = repo.save(u);

        return "User saved with ID: " + savedUser.getId();
    }
}