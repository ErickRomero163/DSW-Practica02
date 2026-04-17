package com.example.empleados.service;

import com.example.empleados.dto.DepartamentoCreateRequest;
import com.example.empleados.dto.DepartamentoResumenResponse;
import com.example.empleados.exception.ConflictException;
import com.example.empleados.model.Departamento;
import com.example.empleados.repository.DepartamentoRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CreateDepartamentoService {

    private final DepartamentoRepository departamentoRepository;
    private final DepartamentoMapper departamentoMapper;

    public CreateDepartamentoService(
            DepartamentoRepository departamentoRepository,
            DepartamentoMapper departamentoMapper
    ) {
        this.departamentoRepository = departamentoRepository;
        this.departamentoMapper = departamentoMapper;
    }

    @Transactional
    public DepartamentoResumenResponse create(DepartamentoCreateRequest request) {
        if (departamentoRepository.existsByNombreIgnoreCase(request.nombre().trim())) {
            throw new ConflictException("Ya existe un departamento con nombre: " + request.nombre().trim());
        }

        Departamento departamento = departamentoMapper.toEntity(request);
        try {
            Departamento saved = departamentoRepository.save(departamento);
            return departamentoMapper.toResumen(saved);
        } catch (DataIntegrityViolationException ex) {
            throw new ConflictException("Ya existe un departamento con nombre: " + request.nombre().trim());
        }
    }
}
