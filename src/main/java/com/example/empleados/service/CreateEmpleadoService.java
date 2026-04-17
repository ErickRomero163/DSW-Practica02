package com.example.empleados.service;

import com.example.empleados.dto.EmpleadoCreateRequest;
import com.example.empleados.dto.EmpleadoResponse;
import com.example.empleados.exception.ConflictException;
import com.example.empleados.exception.ResourceNotFoundException;
import com.example.empleados.model.Departamento;
import com.example.empleados.model.Empleado;
import com.example.empleados.repository.DepartamentoRepository;
import com.example.empleados.repository.EmpleadoRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CreateEmpleadoService {

    private final EmpleadoRepository empleadoRepository;
    private final DepartamentoRepository departamentoRepository;
    private final ClaveEmpleadoGeneratorService claveEmpleadoGeneratorService;
    private final EmpleadoMapper empleadoMapper;

    public CreateEmpleadoService(
            EmpleadoRepository empleadoRepository,
            DepartamentoRepository departamentoRepository,
            ClaveEmpleadoGeneratorService claveEmpleadoGeneratorService,
            EmpleadoMapper empleadoMapper
    ) {
        this.empleadoRepository = empleadoRepository;
        this.departamentoRepository = departamentoRepository;
        this.claveEmpleadoGeneratorService = claveEmpleadoGeneratorService;
        this.empleadoMapper = empleadoMapper;
    }

    @Transactional
    public EmpleadoResponse create(EmpleadoCreateRequest request) {
        Departamento departamento = departamentoRepository.findById(request.departamentoId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Departamento no encontrado con id: " + request.departamentoId()
            ));

        for (int attempt = 0; attempt < 3; attempt++) {
            String clave = claveEmpleadoGeneratorService.nextClave();
            Empleado empleado = empleadoMapper.toEntity(clave, request, departamento);
            try {
                Empleado saved = empleadoRepository.save(empleado);
                return empleadoMapper.toResponse(saved);
            } catch (DataIntegrityViolationException ex) {
            }
        }

        throw new ConflictException("No fue posible crear el empleado por conflicto de clave");
    }
}
