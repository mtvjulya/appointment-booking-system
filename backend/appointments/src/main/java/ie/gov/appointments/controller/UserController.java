package ie.gov.appointments.controller;

import ie.gov.appointments.entity.User;
import ie.gov.appointments.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // CREATE
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    // READ
    @GetMapping
    public List<User> getUsers() {
        return userService.getAllUsers();
    }
}