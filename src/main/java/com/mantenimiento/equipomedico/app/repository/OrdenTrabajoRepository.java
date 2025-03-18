package com.mantenimiento.equipomedico.app.repository;

import java.util.List;

import com.mantenimiento.equipomedico.app.entidad.OrdenTrabajo;
import com.mantenimiento.equipomedico.app.entidad.SolicitudRepuesto;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrdenTrabajoRepository extends CrudRepository<OrdenTrabajo, Long> {
	List<OrdenTrabajo> getAllByEstadoEquals(String estado);
	List<OrdenTrabajo> getAllByTipoServicioAndEstadoEquals(String tipoServicio,String estado);
	List<OrdenTrabajo> getAllByTipoServicioAndEstadoBetween(String tipoServicio,String estado1,String estado2);
	List<OrdenTrabajo> getAllByEquipoId(Long id);

}
