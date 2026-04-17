package com.example.empleados.controller;

import com.example.empleados.dto.EmpleadoResponse;
import com.example.empleados.dto.EmpleadoUpdateRequest;
import com.example.empleados.service.DeleteEmpleadoService;
import com.example.empleados.service.UpdateEmpleadoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/empleados")
public class EmpleadoCommandController {

    private final UpdateEmpleadoService updateEmpleadoService;
    private final DeleteEmpleadoService deleteEmpleadoService;

    public EmpleadoCommandController(
            UpdateEmpleadoService updateEmpleadoService,
            DeleteEmpleadoService deleteEmpleadoService
    ) {
        this.updateEmpleadoService = updateEmpleadoService;
        this.deleteEmpleadoService = deleteEmpleadoService;
    }

    @PutMapping("/{clave}")
    public EmpleadoResponse update(
            @PathVariable String clave,
            @Valid @RequestBody EmpleadoUpdateRequest request
    ) {
        return updateEmpleadoService.update(clave, request);
    }

    @DeleteMapping("/{clave}")
    public ResponseEntity<Void> delete(@PathVariable String clave) {
        deleteEmpleadoService.deleteByClave(clave);
        return ResponseEntity.noContent().build();
    }
}
