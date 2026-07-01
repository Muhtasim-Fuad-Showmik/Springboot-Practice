package com.magnus.employeemanagement.service;

import com.magnus.employeemanagement.dto.DepartmentDto;

public interface DepartmentService {
    DepartmentDto createDepartment(DepartmentDto departmentDto);

    DepartmentDto getDepartmentById(Long departmentId);
}
