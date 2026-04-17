package com.example.empleados.service;

import com.example.empleados.dto.DepartamentoResumenResponse;
import com.example.empleados.repository.DepartamentoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ListDepartamentosService {

    private final DepartamentoRepository departamentoRepository;
    private final DepartamentoMapper departamentoMapper;

    public ListDepartamentosService(
            DepartamentoRepository departamentoRepository,
            DepartamentoMapper departamentoMapper
    ) {
        this.departamentoRepository = departamentoRepository;
        this.departamentoMapper = departamentoMapper;
    }

    @Transactional(readOnly = true)
    public List<DepartamentoResumenResponse> listAll() {
        return departamentoRepository.findAll()
                .stream()
                .map(departamentoMapper::toResumen)
                .toList();
    }
}
