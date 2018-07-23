package com.mantenimiento.equipomedico.app.repository;

import com.mantenimiento.equipomedico.app.entidad.Mantenimiento;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MantenimientoRepository extends CrudRepository<Mantenimiento, Long> {

}
