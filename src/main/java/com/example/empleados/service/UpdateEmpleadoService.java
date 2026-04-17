package com.example.empleados.service;

import com.example.empleados.dto.EmpleadoResponse;
import com.example.empleados.dto.EmpleadoUpdateRequest;
import com.example.empleados.model.Departamento;
import com.example.empleados.exception.ResourceNotFoundException;
import com.example.empleados.model.Empleado;
import com.example.empleados.repository.DepartamentoRepository;
import com.example.empleados.repository.EmpleadoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UpdateEmpleadoService {

    private final EmpleadoRepository empleadoRepository;
    private final DepartamentoRepository departamentoRepository;
    private final EmpleadoMapper empleadoMapper;

    public UpdateEmpleadoService(
            EmpleadoRepository empleadoRepository,
            DepartamentoRepository departamentoRepository,
            EmpleadoMapper empleadoMapper
    ) {
        this.empleadoRepository = empleadoRepository;
        this.departamentoRepository = departamentoRepository;
        this.empleadoMapper = empleadoMapper;
    }

    @Transactional
    public EmpleadoResponse update(String clave, EmpleadoUpdateRequest request) {
        Empleado empleado = empleadoRepository.findById(clave)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado con clave: " + clave));

        Departamento departamento = departamentoRepository.findById(request.departamentoId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Departamento no encontrado con id: " + request.departamentoId()
            ));

        empleadoMapper.applyUpdate(empleado, request, departamento);
        Empleado updated = empleadoRepository.save(empleado);
        return empleadoMapper.toResponse(updated);
    }
}
