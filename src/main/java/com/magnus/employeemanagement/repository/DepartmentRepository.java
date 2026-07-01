package com.magnus.employeemanagement.repository;

import com.magnus.employeemanagement.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

  @Query("SELECT d FROM Department d LEFT JOIN FETCH d.employees")
  List<Department> findAllWithEmployees();

  @Query("SELECT d FROM Department d LEFT JOIN FETCH d.employees WHERE d.id = :id")
  Optional<Department> findByIdWithEmployees(Long id);
}
