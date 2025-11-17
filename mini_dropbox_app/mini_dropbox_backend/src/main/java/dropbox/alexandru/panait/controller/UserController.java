package dropbox.alexandru.panait.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


import dropbox.alexandru.panait.repository.UserRepository;
import dropbox.alexandru.panait.model.User;

@RequestMapping("/test")
public class UserController {

    @Autowired
    private UserRepository repo;

    @GetMapping("/add")
    public String add() {
        User u = new User();
        u.setUsername("alex");
        repo.save(u);
        return "saved";
    }
}
