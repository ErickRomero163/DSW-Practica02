package com.example.empleados.controller;

import com.example.empleados.dto.DepartamentoResumenResponse;
import com.example.empleados.dto.DepartamentoUpdateRequest;
import com.example.empleados.service.DeleteDepartamentoService;
import com.example.empleados.service.UpdateDepartamentoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/departamentos")
public class DepartamentoCommandController {

    private final UpdateDepartamentoService updateDepartamentoService;
    private final DeleteDepartamentoService deleteDepartamentoService;

    public DepartamentoCommandController(
            UpdateDepartamentoService updateDepartamentoService,
            DeleteDepartamentoService deleteDepartamentoService
    ) {
        this.updateDepartamentoService = updateDepartamentoService;
        this.deleteDepartamentoService = deleteDepartamentoService;
    }

    @PutMapping("/{id}")
    public DepartamentoResumenResponse update(@PathVariable Long id, @Valid @RequestBody DepartamentoUpdateRequest request) {
        return updateDepartamentoService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        deleteDepartamentoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
