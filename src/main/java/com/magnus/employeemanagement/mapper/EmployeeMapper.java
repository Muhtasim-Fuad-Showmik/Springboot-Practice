package com.magnus.employeemanagement.mapper;

import com.magnus.employeemanagement.dto.DepartmentDto;
import com.magnus.employeemanagement.dto.EmployeeDto;
import com.magnus.employeemanagement.entity.Employee;

import java.util.List;

public class EmployeeMapper {
    private EmployeeMapper() {
    }

    public static EmployeeDto mapToEmployeeDto(Employee employee) {
        List<DepartmentDto> departmentDtos = employee.getDepartments().stream()
                .map(DepartmentMapper::mapToDepartmentDto)
                .toList();

        return new EmployeeDto(
                employee.getId(),
                employee.getFirstName(),
                employee.getLastName(),
                employee.getEmail(),
                departmentDtos);
    }

    public static Employee mapToEmployee(EmployeeDto employeeDto) {
        Employee employee = new Employee();
        employee.setId(employeeDto.getId());
        employee.setFirstName(employeeDto.getFirstName());
        employee.setLastName(employeeDto.getLastName());
        employee.setEmail(employeeDto.getEmail());
        return employee;
    }
}
