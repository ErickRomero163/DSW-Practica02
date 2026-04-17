package com.example.empleados.service;

import com.example.empleados.exception.ResourceNotFoundException;
import com.example.empleados.repository.EmpleadoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DeleteEmpleadoService {

    private final EmpleadoRepository empleadoRepository;

    public DeleteEmpleadoService(EmpleadoRepository empleadoRepository) {
        this.empleadoRepository = empleadoRepository;
    }

    @Transactional
    public void deleteByClave(String clave) {
        if (!empleadoRepository.existsById(clave)) {
            throw new ResourceNotFoundException("Empleado no encontrado con clave: " + clave);
        }
        empleadoRepository.deleteById(clave);
    }
}
