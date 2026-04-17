package com.example.empleados.controller;

import com.example.empleados.dto.DepartamentoCreateRequest;
import com.example.empleados.dto.DepartamentoResumenResponse;
import com.example.empleados.service.CreateDepartamentoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/departamentos")
public class DepartamentoCreateController {

    private final CreateDepartamentoService createDepartamentoService;

    public DepartamentoCreateController(CreateDepartamentoService createDepartamentoService) {
        this.createDepartamentoService = createDepartamentoService;
    }

    @PostMapping
    public ResponseEntity<DepartamentoResumenResponse> create(@Valid @RequestBody DepartamentoCreateRequest request) {
        DepartamentoResumenResponse response = createDepartamentoService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
