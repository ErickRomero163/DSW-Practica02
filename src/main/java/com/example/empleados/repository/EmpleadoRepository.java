package com.example.empleados.repository;

import com.example.empleados.model.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmpleadoRepository extends JpaRepository<Empleado, String> {
	boolean existsByDepartamentoId(Long departamentoId);

	List<Empleado> findByDepartamentoIdOrderByNombreAsc(Long departamentoId);
}
