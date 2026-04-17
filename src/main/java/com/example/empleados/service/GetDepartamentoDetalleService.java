package com.example.empleados.service;

import com.example.empleados.dto.DepartamentoDetalleResponse;
import com.example.empleados.exception.ResourceNotFoundException;
import com.example.empleados.model.Departamento;
import com.example.empleados.model.Empleado;
import com.example.empleados.repository.DepartamentoRepository;
import com.example.empleados.repository.EmpleadoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class GetDepartamentoDetalleService {

    private final DepartamentoRepository departamentoRepository;
    private final EmpleadoRepository empleadoRepository;
    private final DepartamentoMapper departamentoMapper;

    public GetDepartamentoDetalleService(
            DepartamentoRepository departamentoRepository,
            EmpleadoRepository empleadoRepository,
            DepartamentoMapper departamentoMapper
    ) {
        this.departamentoRepository = departamentoRepository;
        this.empleadoRepository = empleadoRepository;
        this.departamentoMapper = departamentoMapper;
    }

    @Transactional(readOnly = true)
    public DepartamentoDetalleResponse getDetalleById(Long id) {
        Departamento departamento = departamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Departamento no encontrado con id: " + id));

        List<Empleado> empleados = empleadoRepository.findByDepartamentoIdOrderByNombreAsc(id);
        return departamentoMapper.toDetalle(departamento, empleados);
    }
}
