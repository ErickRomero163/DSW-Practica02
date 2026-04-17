package com.example.empleados.service;

import com.example.empleados.exception.ConflictException;
import com.example.empleados.exception.ResourceNotFoundException;
import com.example.empleados.repository.DepartamentoRepository;
import com.example.empleados.repository.EmpleadoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DeleteDepartamentoService {

    private final DepartamentoRepository departamentoRepository;
    private final EmpleadoRepository empleadoRepository;

    public DeleteDepartamentoService(
            DepartamentoRepository departamentoRepository,
            EmpleadoRepository empleadoRepository
    ) {
        this.departamentoRepository = departamentoRepository;
        this.empleadoRepository = empleadoRepository;
    }

    @Transactional
    public void deleteById(Long id) {
        if (!departamentoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Departamento no encontrado con id: " + id);
        }

        if (empleadoRepository.existsByDepartamentoId(id)) {
            throw new ConflictException("No se puede eliminar el departamento porque tiene empleados asociados");
        }

        departamentoRepository.deleteById(id);
    }
}
