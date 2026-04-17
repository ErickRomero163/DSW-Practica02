package com.example.empleados.dto;

import java.util.List;

public record DepartamentoDetalleResponse(
        Long id,
        String nombre,
        String descripcion,
        List<EmpleadoResumenResponse> empleados
) {
}
