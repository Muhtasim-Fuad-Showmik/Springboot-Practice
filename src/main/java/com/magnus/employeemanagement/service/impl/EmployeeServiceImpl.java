package com.magnus.employeemanagement.service.impl;

import com.magnus.employeemanagement.dto.EmployeeDto;
import com.magnus.employeemanagement.entity.Employee;
import com.magnus.employeemanagement.exception.ResourceNotFoundException;
import com.magnus.employeemanagement.mapper.EmployeeMapper;
import com.magnus.employeemanagement.repository.EmployeeRepository;
import com.magnus.employeemanagement.service.EmployeeService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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
        Employee employee = employeeRepository.findByIdWithDepartments(employeeId)
                .orElseThrow(
                        () -> new ResourceNotFoundException(("Employee with given ID does not exist : " + employeeId)));

        return EmployeeMapper.mapToEmployeeDto(employee);
    }

    @Override
    public List<EmployeeDto> getAllEmployees() {
        List<Employee> employees = employeeRepository.findAllWithDepartments();
        return employees.stream().map(EmployeeMapper::mapToEmployeeDto)
                .collect(Collectors.toList());
    }

    @Override
    public EmployeeDto updateEmployee(Long employeeId, EmployeeDto updatedEmployee) {
        // Verify employee with provided ID exists
        Employee employee = employeeRepository.findByIdWithDepartments(employeeId)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Employee with given ID does not exist : " + employeeId));

        // Update employee information (everything but ID)
        if (updatedEmployee.getFirstName() != null) {
            employee.setFirstName(updatedEmployee.getFirstName());
        }
        if (updatedEmployee.getLastName() != null) {
            employee.setLastName(updatedEmployee.getLastName());
        }
        if (updatedEmployee.getEmail() != null) {
            employee.setEmail(updatedEmployee.getEmail());
        }

        // Updates employee with provided information based on provided employee ID
        Employee updatedEntity = employeeRepository.save(employee);

        return EmployeeMapper.mapToEmployeeDto(updatedEntity);
    }

    @Override
    public String deleteEmployee(long employeeId) {
        // Verify employee with provided ID exists
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Employee with given ID does not exist : " + employeeId));

        employeeRepository.deleteById(employeeId);
        return "Employee with ID "
                + employeeId
                + " and name " + employee.getFirstName() + " " + employee.getLastName()
                + " has been deleted";
    }
}
