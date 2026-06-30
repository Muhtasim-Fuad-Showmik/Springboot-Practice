package com.magnus.employeemanagement.repository;

import com.magnus.employeemanagement.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

// JpaRepository type is defined by entity in the first parameter and
// data type of the primary key in the second parameter
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

}
