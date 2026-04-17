package com.example.empleados.service;

import com.example.empleados.dto.EmpleadoResponse;
import com.example.empleados.exception.ResourceNotFoundException;
import com.example.empleados.model.Empleado;
import com.example.empleados.repository.EmpleadoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GetEmpleadoByClaveService {

    private final EmpleadoRepository empleadoRepository;
    private final EmpleadoMapper empleadoMapper;

    public GetEmpleadoByClaveService(EmpleadoRepository empleadoRepository, EmpleadoMapper empleadoMapper) {
        this.empleadoRepository = empleadoRepository;
        this.empleadoMapper = empleadoMapper;
    }

    @Transactional(readOnly = true)
    public EmpleadoResponse getByClave(String clave) {
        Empleado empleado = empleadoRepository.findById(clave)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado con clave: " + clave));
        return empleadoMapper.toResponse(empleado);
    }
}
