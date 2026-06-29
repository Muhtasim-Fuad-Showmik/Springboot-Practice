package com.magnus.store;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class StudentController {
    @GetMapping("student")
    public Student getStudent() {
        return new Student(
                1,
                "Muhtasim",
                "Fuad");
    }

    @GetMapping("students")
    public List<Student> getStudents() {
        List<Student> students = new ArrayList<>();
        students.add(new Student(
                1,
                "Muhtasim",
                "Fuad"));
        students.add(new Student(
                2,
                "John",
                "Doe"));
        students.add(new Student(
                3,
                "Jane",
                "Doe"));
        students.add(new Student(
                4,
                "Bob",
                "Smith"));

        return students;
    }
}
