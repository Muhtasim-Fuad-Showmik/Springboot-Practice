package com.magnus.employeemanagement.repository;

import com.magnus.employeemanagement.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

// JpaRepository type is defined by entity in the first parameter and
// data type of the primary key in the second parameter
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

  @Query("SELECT e FROM Employee e LEFT JOIN FETCH e.departments")
  List<Employee> findAllWithDepartments();

  @Query("SELECT e FROM Employee e LEFT JOIN FETCH e.departments WHERE e.id = :id")
  Optional<Employee> findByIdWithDepartments(Long id);
}
