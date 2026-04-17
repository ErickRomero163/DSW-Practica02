package com.example.empleados.service;

import com.example.empleados.dto.DepartamentoResumenResponse;
import com.example.empleados.dto.DepartamentoUpdateRequest;
import com.example.empleados.exception.ConflictException;
import com.example.empleados.exception.ResourceNotFoundException;
import com.example.empleados.model.Departamento;
import com.example.empleados.repository.DepartamentoRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UpdateDepartamentoService {

    private final DepartamentoRepository departamentoRepository;
    private final DepartamentoMapper departamentoMapper;

    public UpdateDepartamentoService(
            DepartamentoRepository departamentoRepository,
            DepartamentoMapper departamentoMapper
    ) {
        this.departamentoRepository = departamentoRepository;
        this.departamentoMapper = departamentoMapper;
    }

    @Transactional
    public DepartamentoResumenResponse update(Long id, DepartamentoUpdateRequest request) {
        Departamento departamento = departamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Departamento no encontrado con id: " + id));

        departamentoMapper.applyUpdate(departamento, request);

        try {
            Departamento saved = departamentoRepository.save(departamento);
            return departamentoMapper.toResumen(saved);
        } catch (DataIntegrityViolationException ex) {
            throw new ConflictException("Ya existe un departamento con nombre: " + request.nombre().trim());
        }
    }
}
