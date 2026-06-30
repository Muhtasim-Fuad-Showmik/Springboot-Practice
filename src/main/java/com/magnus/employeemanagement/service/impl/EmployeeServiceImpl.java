package com.magnus.employeemanagement.service.impl;

import com.magnus.employeemanagement.dto.EmployeeDto;
import com.magnus.employeemanagement.entity.Employee;
import com.magnus.employeemanagement.exception.ResourceNotFoundException;
import com.magnus.employeemanagement.mapper.EmployeeMapper;
import com.magnus.employeemanagement.repository.EmployeeRepository;
import com.magnus.employeemanagement.service.EmployeeService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {
    private EmployeeRepository employeeRepository;

    @Override
    public EmployeeDto createEmployee(EmployeeDto employeeDto) {
        Employee employee = EmployeeMapper.mapToEmployee(employeeDto);
        Employee savedEmployee = employeeRepository.save(employee);
        return EmployeeMapper.mapToEmployeeDto(savedEmployee);
    }

    @Override
    public EmployeeDto getEmployeeById(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(("Employee with given Id does not exist : " + employeeId)));

        return EmployeeMapper.mapToEmployeeDto(employee);
    }
}
