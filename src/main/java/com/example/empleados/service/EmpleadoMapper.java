package com.example.empleados.service;

import com.example.empleados.dto.EmpleadoCreateRequest;
import com.example.empleados.dto.EmpleadoResponse;
import com.example.empleados.dto.EmpleadoUpdateRequest;
import com.example.empleados.dto.DepartamentoResumenResponse;
import com.example.empleados.model.Departamento;
import com.example.empleados.model.Empleado;
import org.springframework.stereotype.Component;

@Component
public class EmpleadoMapper {

    public Empleado toEntity(String clave, EmpleadoCreateRequest request, Departamento departamento) {
        return new Empleado(clave, request.nombre(), request.direccion(), request.telefono(), departamento);
    }

    public EmpleadoResponse toResponse(Empleado empleado) {
        return new EmpleadoResponse(
                empleado.getClave(),
                empleado.getNombre(),
                empleado.getDireccion(),
                empleado.getTelefono(),
                new DepartamentoResumenResponse(
                        empleado.getDepartamento().getId(),
                        empleado.getDepartamento().getNombre(),
                        empleado.getDepartamento().getDescripcion()
                )
        );
    }

    public void applyUpdate(Empleado empleado, EmpleadoUpdateRequest request, Departamento departamento) {
        empleado.setNombre(request.nombre());
        empleado.setDireccion(request.direccion());
        empleado.setTelefono(request.telefono());
        empleado.setDepartamento(departamento);
    }
}
