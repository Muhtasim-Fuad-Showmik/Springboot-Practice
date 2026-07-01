package com.magnus.employeemanagement.service.impl;

import com.magnus.employeemanagement.dto.DepartmentDto;
import com.magnus.employeemanagement.entity.Department;
import com.magnus.employeemanagement.exception.ResourceNotFoundException;
import com.magnus.employeemanagement.mapper.DepartmentMapper;
import com.magnus.employeemanagement.repository.DepartmentRepository;
import com.magnus.employeemanagement.service.DepartmentService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {
    private DepartmentRepository departmentRepository;

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
                        () -> new ResourceNotFoundException("Department with given ID does not exist : " + departmentId)
                );
        return DepartmentMapper.mapToDepartmentDto(department);
    }
}
