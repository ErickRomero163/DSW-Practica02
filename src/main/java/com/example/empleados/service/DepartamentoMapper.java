package com.example.empleados.service;

import com.example.empleados.dto.DepartamentoCreateRequest;
import com.example.empleados.dto.DepartamentoDetalleResponse;
import com.example.empleados.dto.DepartamentoResumenResponse;
import com.example.empleados.dto.DepartamentoUpdateRequest;
import com.example.empleados.dto.EmpleadoResumenResponse;
import com.example.empleados.model.Departamento;
import com.example.empleados.model.Empleado;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DepartamentoMapper {

    public Departamento toEntity(DepartamentoCreateRequest request) {
        return new Departamento(request.nombre().trim(), normalizeDescripcion(request.descripcion()));
    }

    public DepartamentoResumenResponse toResumen(Departamento departamento) {
        return new DepartamentoResumenResponse(
                departamento.getId(),
                departamento.getNombre(),
                departamento.getDescripcion()
        );
    }

    public DepartamentoDetalleResponse toDetalle(Departamento departamento, List<Empleado> empleados) {
        List<EmpleadoResumenResponse> empleadosResumen = empleados.stream()
                .map(empleado -> new EmpleadoResumenResponse(empleado.getClave(), empleado.getNombre()))
                .toList();

        return new DepartamentoDetalleResponse(
                departamento.getId(),
                departamento.getNombre(),
                departamento.getDescripcion(),
                empleadosResumen
        );
    }

    public void applyUpdate(Departamento departamento, DepartamentoUpdateRequest request) {
        departamento.setNombre(request.nombre().trim());
        departamento.setDescripcion(normalizeDescripcion(request.descripcion()));
    }

    private String normalizeDescripcion(String descripcion) {
        if (descripcion == null) {
            return null;
        }
        String trimmed = descripcion.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
