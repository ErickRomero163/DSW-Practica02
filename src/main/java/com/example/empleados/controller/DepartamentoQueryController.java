package com.example.empleados.controller;

import com.example.empleados.dto.DepartamentoDetalleResponse;
import com.example.empleados.dto.DepartamentoResumenResponse;
import com.example.empleados.service.GetDepartamentoDetalleService;
import com.example.empleados.service.ListDepartamentosService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/departamentos")
public class DepartamentoQueryController {

    private final ListDepartamentosService listDepartamentosService;
    private final GetDepartamentoDetalleService getDepartamentoDetalleService;

    public DepartamentoQueryController(
            ListDepartamentosService listDepartamentosService,
            GetDepartamentoDetalleService getDepartamentoDetalleService
    ) {
        this.listDepartamentosService = listDepartamentosService;
        this.getDepartamentoDetalleService = getDepartamentoDetalleService;
    }

    @GetMapping
    public List<DepartamentoResumenResponse> listAll() {
        return listDepartamentosService.listAll();
    }

    @GetMapping("/{id}")
    public DepartamentoDetalleResponse getById(@PathVariable Long id) {
        return getDepartamentoDetalleService.getDetalleById(id);
    }
}
