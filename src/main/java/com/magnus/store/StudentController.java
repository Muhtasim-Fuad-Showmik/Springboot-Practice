package com.magnus.store;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("students/{id}") // id here is a URI template variable
    public Student studentPathVariable(@PathVariable("id") int studentId) {
        // @PathVariable("id") int studentId is being used to bind studentId to id.
        // When both variables are named the same, the "id" no longer needs to be specified within the parentheses
        return new Student(studentId, "Muhtasim", "Fuad");
    }

    @GetMapping("students/query")
    public Student studentRequestVariable(@RequestParam int id) {
        return new Student(id, "Muhtasim", "Fuad");
    }

    @PostMapping("students/create")
    @ResponseStatus(HttpStatus.CREATED)
    public Student createStudent(@RequestBody Student student) {
        System.out.println("ID: " + student.getId());
        System.out.println("First Name: " + student.getFirstName());
        System.out.println("Last Name: " + student.getLastName());
        return student;
    }

    @PutMapping("students/{id}/update")
    public Student updateStudent(@RequestBody Student student, @PathVariable("id") int studentId) {
        System.out.println("First Name: " + student.getFirstName());
        System.out.println("Last Name: " + student.getLastName());
        return student;
    }

    @DeleteMapping("students/{id}/delete")
    public String deleteStudent(@PathVariable("id") int studentId) {
        System.out.println(studentId);
        return "Student deleted successfully!";
    }
}
