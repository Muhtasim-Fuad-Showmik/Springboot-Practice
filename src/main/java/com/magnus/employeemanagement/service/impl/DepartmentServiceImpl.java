package com.magnus.employeemanagement.service.impl;

import com.magnus.employeemanagement.dto.DepartmentDto;
import com.magnus.employeemanagement.entity.Department;
import com.magnus.employeemanagement.exception.ResourceNotFoundException;
import com.magnus.employeemanagement.mapper.DepartmentMapper;
import com.magnus.employeemanagement.repository.DepartmentRepository;
import com.magnus.employeemanagement.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {
    private final DepartmentRepository departmentRepository;

    @Override
    public DepartmentDto createDepartment(DepartmentDto departmentDto) {
        Department department = DepartmentMapper.mapToDepartment(departmentDto);
        Department savedDepartment = departmentRepository.save(department);
        return DepartmentMapper.mapToDepartmentDto(savedDepartment);
    }

    @Override
    public DepartmentDto getDepartmentById(Long departmentId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Department with given ID does not exist : " + departmentId));
        return DepartmentMapper.mapToDepartmentDto(department);
    }

    @Override
    public List<DepartmentDto> getAllDepartments() {
        List<Department> departments = departmentRepository.findAll();
        return departments.stream().map(
                DepartmentMapper::mapToDepartmentDto)
                .collect(Collectors.toList());
    }

    @Override
    public DepartmentDto updateDepartment(Long departmentId, DepartmentDto updatedDepartment) {
        // Verify department with provided ID exists
        Department department = departmentRepository.findById(departmentId)
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
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Department with given ID does not exist : " + departmentId));
        departmentRepository.deleteById(departmentId);
        return "Department with ID "
                + departmentId
                + " and name " + department.getName()
                + " has been deleted";
    }
}
