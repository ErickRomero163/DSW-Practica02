package com.example.empleados.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class ClaveEmpleadoGeneratorService {

    private final JdbcTemplate jdbcTemplate;

    public ClaveEmpleadoGeneratorService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public String nextClave() {
        Long sequenceValue = jdbcTemplate.queryForObject("SELECT nextval('empleado_seq')", Long.class);
        if (sequenceValue == null) {
            throw new IllegalStateException("No se pudo generar secuencia para clave de empleado");
        }
        return "E-" + sequenceValue;
    }
}
