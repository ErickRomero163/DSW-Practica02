package com.example.empleados.service;

import com.example.empleados.dto.DepartamentoResumenResponse;
import com.example.empleados.exception.ResourceNotFoundException;
import com.example.empleados.model.Departamento;
import com.example.empleados.repository.DepartamentoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GetDepartamentoByIdService {

    private final DepartamentoRepository departamentoRepository;
    private final DepartamentoMapper departamentoMapper;

    public GetDepartamentoByIdService(
            DepartamentoRepository departamentoRepository,
            DepartamentoMapper departamentoMapper
    ) {
        this.departamentoRepository = departamentoRepository;
        this.departamentoMapper = departamentoMapper;
    }

    @Transactional(readOnly = true)
    public DepartamentoResumenResponse getById(Long id) {
        Departamento departamento = departamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Departamento no encontrado con id: " + id));
        return departamentoMapper.toResumen(departamento);
    }
}
