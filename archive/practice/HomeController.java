package com.magnus.employeemanagement;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller // Used for controllers that are meant to return template files with filename on
            // returned string
public class HomeController {
    @Value("${spring.application.name}")
    private String appName;

    @RequestMapping("/") // Generic request matching for GET, POST, PUT, etc, everything
    public String index() {
        System.out.println("App Name: " + appName);
        return "index.html";
    }
}
