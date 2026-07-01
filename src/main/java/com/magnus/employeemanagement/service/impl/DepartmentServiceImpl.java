package com.magnus.employeemanagement.service.impl;

import com.magnus.employeemanagement.dto.DepartmentDto;
import com.magnus.employeemanagement.entity.Department;
import com.magnus.employeemanagement.entity.Employee;
import com.magnus.employeemanagement.exception.ResourceNotFoundException;
import com.magnus.employeemanagement.mapper.DepartmentMapper;
import com.magnus.employeemanagement.repository.DepartmentRepository;
import com.magnus.employeemanagement.repository.EmployeeRepository;
import com.magnus.employeemanagement.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {
    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    public DepartmentDto createDepartment(DepartmentDto departmentDto) {
        Department department = DepartmentMapper.mapToDepartment(departmentDto);
        Department savedDepartment = departmentRepository.save(department);
        return DepartmentMapper.mapToDepartmentDto(savedDepartment);
    }

    @Override
    public DepartmentDto getDepartmentById(Long departmentId) {
        Department department = departmentRepository.findByIdWithEmployees(departmentId)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Department with given ID does not exist : " + departmentId));
        return DepartmentMapper.mapToDepartmentDto(department);
    }

    @Override
    public List<DepartmentDto> getAllDepartments() {
        List<Department> departments = departmentRepository.findAllWithEmployees();
        return departments.stream().map(
                DepartmentMapper::mapToDepartmentDto)
                .collect(Collectors.toList());
    }

    @Override
    public DepartmentDto updateDepartment(Long departmentId, DepartmentDto updatedDepartment) {
        // Verify department with provided ID exists
        Department department = departmentRepository.findByIdWithEmployees(departmentId)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Department with given ID does not exist : " + departmentId));

        // Update department information (everything but ID)
        if (updatedDepartment.getName() != null) {
            department.setName(updatedDepartment.getName());
        }
        if (updatedDepartment.getDescription() != null) {
            department.setDescription(updatedDepartment.getDescription());
        }

        // Updates department with provided information based on provided department ID
        Department savedDepartment = departmentRepository.save(department);

        return DepartmentMapper.mapToDepartmentDto(savedDepartment);
    }

    @Override
    public String deleteDepartment(Long departmentId) {
        Department department = departmentRepository.findByIdWithEmployees(departmentId)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Department with given ID does not exist : " + departmentId));
        departmentRepository.deleteById(departmentId);
        return "Department with ID "
                + departmentId
                + " and name " + department.getName()
                + " has been deleted";
    }

    @Override
    @Transactional
    public DepartmentDto setDepartmentEmployees(Long departmentId, List<Long> employeeIds) {
        Department department = departmentRepository.findByIdWithEmployees(departmentId)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Department with given ID does not exist : " + departmentId));

        // Remove department from all currently assigned employees
        for (Employee emp : department.getEmployees()) {
            emp.getDepartments().remove(department);
        }
        department.getEmployees().clear();

        // Add department to the new set of employees
        List<Employee> newEmployees = employeeRepository.findAllById(employeeIds);
        for (Employee emp : newEmployees) {
            emp.getDepartments().add(department);
            department.getEmployees().add(emp);
        }

        Department savedDepartment = departmentRepository.save(department);
        return DepartmentMapper.mapToDepartmentDto(savedDepartment);
    }
}
