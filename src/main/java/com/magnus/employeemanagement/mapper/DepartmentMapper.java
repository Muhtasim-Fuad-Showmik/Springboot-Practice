package com.magnus.employeemanagement.mapper;

import com.magnus.employeemanagement.dto.DepartmentDto;
import com.magnus.employeemanagement.entity.Department;

public class DepartmentMapper {
    private DepartmentMapper() {
    }

    public static DepartmentDto mapToDepartmentDto(Department department) {
        return new DepartmentDto(
                department.getId(),
                department.getName(),
                department.getDescription());
    }

    public static Department mapToDepartment(DepartmentDto departmentDto) {
        Department department = new Department();
        department.setId(departmentDto.getId());
        department.setName(departmentDto.getName());
        department.setDescription(departmentDto.getDescription());
        return department;
    }
}
