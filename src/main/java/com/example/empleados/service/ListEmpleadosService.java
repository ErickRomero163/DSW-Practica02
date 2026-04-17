package com.example.empleados.service;

import com.example.empleados.dto.EmpleadoResponse;
import com.example.empleados.repository.EmpleadoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ListEmpleadosService {

    private final EmpleadoRepository empleadoRepository;
    private final EmpleadoMapper empleadoMapper;

    public ListEmpleadosService(EmpleadoRepository empleadoRepository, EmpleadoMapper empleadoMapper) {
        this.empleadoRepository = empleadoRepository;
        this.empleadoMapper = empleadoMapper;
    }

    @Transactional(readOnly = true)
    public List<EmpleadoResponse> listAll() {
        return empleadoRepository.findAll()
                .stream()
                .map(empleadoMapper::toResponse)
                .toList();
    }
}
