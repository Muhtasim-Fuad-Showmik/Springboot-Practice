package com.magnus.store;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
public class StudentController {
    @GetMapping("student")
    public ResponseEntity<Student> getStudent() {
        Student student = new Student(
                1,
                "Muhtasim",
                "Fuad");

        // Both approach from below are okay
        // return new ResponseEntity<>(student, HttpStatus.OK);
        return ResponseEntity.ok()
                .header("Custom-Header", "Custom-Value")
                .body(student);
    }

    @GetMapping("students")
    public ResponseEntity<List<Student>> getStudents() {
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

        return ResponseEntity.ok(students);
    }

    @GetMapping("students/{id}") // id here is a URI template variable
    public ResponseEntity<Student> studentPathVariable(@PathVariable("id") int studentId) {
        // @PathVariable("id") int studentId is being used to bind studentId to id.
        // When both variables are named the same, the "id" no longer needs to be
        // specified within the parentheses
        Student student = new Student(studentId, "Muhtasim", "Fuad");
        return ResponseEntity.ok(student);
    }

    @GetMapping("students/query")
    public ResponseEntity<Student> studentRequestVariable(@RequestParam int id) {
        Student student = new Student(id, "Muhtasim", "Fuad");
        return ResponseEntity.ok(student);
    }

    @PostMapping("students/create")
    // @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Student> createStudent(@RequestBody Student student) {
        System.out.println("ID: " + student.getId());
        System.out.println("First Name: " + student.getFirstName());
        System.out.println("Last Name: " + student.getLastName());
        return new ResponseEntity<>(student, HttpStatus.CREATED);
    }

    @PutMapping("students/{id}/update")
    public ResponseEntity<Student> updateStudent(@RequestBody Student student, @PathVariable("id") int studentId) {
        System.out.println("First Name: " + student.getFirstName());
        System.out.println("Last Name: " + student.getLastName());
        return ResponseEntity.ok(student);
    }

    @DeleteMapping("students/{id}/delete")
    public ResponseEntity<String> deleteStudent(@PathVariable("id") int studentId) {
        System.out.println(studentId);
        return ResponseEntity.ok("Student deleted successfully!");
    }
}
