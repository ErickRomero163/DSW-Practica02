package com.example.empleados.controller;

import com.example.empleados.dto.EmpleadoResponse;
import com.example.empleados.service.GetEmpleadoByClaveService;
import com.example.empleados.service.ListEmpleadosService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/empleados")
public class EmpleadoQueryController {

    private final GetEmpleadoByClaveService getEmpleadoByClaveService;
    private final ListEmpleadosService listEmpleadosService;

    public EmpleadoQueryController(
            GetEmpleadoByClaveService getEmpleadoByClaveService,
            ListEmpleadosService listEmpleadosService
    ) {
        this.getEmpleadoByClaveService = getEmpleadoByClaveService;
        this.listEmpleadosService = listEmpleadosService;
    }

    @GetMapping("/{clave}")
    public EmpleadoResponse getByClave(@PathVariable String clave) {
        return getEmpleadoByClaveService.getByClave(clave);
    }

    @GetMapping
    public List<EmpleadoResponse> listAll() {
        return listEmpleadosService.listAll();
    }
}
