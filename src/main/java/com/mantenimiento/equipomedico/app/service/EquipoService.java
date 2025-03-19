package com.mantenimiento.equipomedico.app.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.mantenimiento.equipomedico.app.entidad.Equipo;
import com.mantenimiento.equipomedico.app.entidad.EquipoDTO;
import com.mantenimiento.equipomedico.app.entidad.MetricasDTO;
import org.springframework.stereotype.Service;

@Service
public interface EquipoService
{

	/**
	 * Creación de un nuevo equipo.
	 *
	 * @param equipo
	 * @return
	 */
	Equipo create(Equipo equipo);

	/**
	 * Obtiene el equipo mediante su id.
	 *
	 * @param id
	 * @return
	 */
	Equipo get(Long id);

	/**
	 * Obtiene todos los equipos.
	 *
	 * @return
	 */
	List<Equipo> getAll();

	/**
	 * Obtiene todos los equipos sin contrato
	 *
	 * @return
	 */
	List<Equipo> getSinContrato();


	/**
	 * Obtiene la lista de equipos con el último controtao
	 *
	 * @return
	 */
	List<EquipoDTO> findEquiposWithUltimoContrato();

	/**
	 * Obtiene el equipo mediante su numero patrimonial.
	 *
	 * @param numeroPatrimonial
	 * @return
	 */
	Equipo getByNumeroPatrimonialAndEstadoEquals(String numeroPatrimonial, String estado);

	/**
	 * Obtiene el equipo mediante su numero de serie.
	 *
	 * @param numeroSerie
	 * @return
	 */
	Equipo getByNumeroSerieEquals(String numeroSerie);

	Equipo getEquiposByNumeroSerieAndNumeroPatrimonialEquals(String numeroSerie, String numeroPatrimonial);

	List<Equipo> getEquiposByNumeroSerieContains(String numeroSerie);

	List<Equipo> getEquiposByNumeroPatrimonialContains(String numeroPatrimonial);

	List<Equipo> getEquiposByNumeroSerieContainsAndNumeroPatrimonialContains(String numeroSerie, String numeroPatrimonial);

	List<Equipo> getEquiposByFilter(Map<String, String> customQuery);

	/**
	 * Cambio de estado
	 * @param id el id del equipo
	 * @param estado el estado del equipo
	 * @return
	 */
	Equipo cambioEstado(Long id, String estado);

	MetricasDTO calculoMetricas(Long equipoId, Date fechaInicio, Date fechaFin);
}
