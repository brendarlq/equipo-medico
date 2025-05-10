package com.mantenimiento.equipomedico.app.controller;

import java.net.URI;
import java.net.URISyntaxException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.mantenimiento.equipomedico.app.entidad.Equipo;
import com.mantenimiento.equipomedico.app.entidad.EquipoDTO;
import com.mantenimiento.equipomedico.app.entidad.MetricasDTO;
import com.mantenimiento.equipomedico.app.service.EquipoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/equipos")
public class EquipoController
{

	@Autowired
	private EquipoService equipoService;

	public EquipoController(EquipoService equipoService)
	{
		this.equipoService = equipoService;
	}

	/**
	 * Creación de un nuevo equipo.
	 *
	 * @param equipo
	 * @return
	 * @throws URISyntaxException
	 */
	@RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Equipo> create(@RequestBody Equipo equipo) throws URISyntaxException
	{
		Equipo result = equipoService.create(equipo);
		return ResponseEntity.created(new URI("/api/equipos/" + result.getId()))
			.body(result);
	}

	/**
	 * Edición de un equipo existente.
	 *
	 * @param equipo
	 * @return
	 * @throws URISyntaxException
	 */
	@RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Equipo> update(@RequestBody Equipo equipo) throws URISyntaxException
	{
		Equipo result = equipoService.create(equipo);
		return ResponseEntity.created(new URI("/api/equipos/" + result.getId()))
			.body(result);
	}

	/**
	 * Obtiene la lista de equipos.
	 *
	 * @return equipos lista de equipos.
	 */
	@RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public List<Equipo> getAll()
	{
		return equipoService.getAll();
	}

	/**
	 * Obtiene la lista de equipos sin contrato.
	 *
	 * @return equipos lista de equipos sin contrato
	 */
	@RequestMapping(value = "/sincontrato", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public List<Equipo> getSinContrato()
	{
		return equipoService.getSinContrato();
	}

	/**
	 * Obtiene determinado equipo.
	 *
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Equipo> get(@PathVariable Long id)
	{
		Equipo equipo = equipoService.get(id);
		return Optional.ofNullable(equipo)
			.map(result -> new ResponseEntity<>(
				result,
				HttpStatus.OK))
			.orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	@RequestMapping(value = "equipoDTO/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<EquipoDTO> getEquipoDTO(@PathVariable Long id)
	{
		EquipoDTO equipo = equipoService.getEquipoDTO(id);
		return Optional.ofNullable(equipo)
			.map(result -> new ResponseEntity<>(
				result,
				HttpStatus.OK))
			.orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}


	/**
	 * Obtiene determinado equipo por numero patrimonial
	 *
	 * @param numeroPatrimonial
	 * @return
	 */
	@RequestMapping(value = "/by-numero/patrimonial/{numeroPatrimonial}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<EquipoDTO> getByNumeroPatrimonial(@PathVariable String numeroPatrimonial)
	{
		EquipoDTO equipo = equipoService.getByNumeroPatrimonialAndEstadoEquals(numeroPatrimonial, "Operativo");
		return Optional.ofNullable(equipo)
			.map(result -> new ResponseEntity<>(
				result,
				HttpStatus.OK))
			.orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	/**
	 * Obtiene determinado equipo por numero de serie
	 *
	 * @param numeroSerie
	 * @return
	 */
	@RequestMapping(value = "/by-numero-serie/{numeroSerie}",
		method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<EquipoDTO> getByNumeroSerie(@PathVariable String numeroSerie)
	{
		EquipoDTO equipo = equipoService.getByNumeroSerieEquals(numeroSerie);
		return Optional.ofNullable(equipo)
			.map(result -> new ResponseEntity<>(
				result,
				HttpStatus.OK))
			.orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	@RequestMapping(value = "/by-numero-serie/by-numero/patrimonial/{numeroSerie}/{numeroPatrimonial}",
		method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<EquipoDTO> getByNumeroSerieAndNumeroPatrimonial(
		@PathVariable String numeroSerie,
		@PathVariable String numeroPatrimonial)
	{
		EquipoDTO equipo = equipoService.getEquiposByNumeroSerieAndNumeroPatrimonialEquals(numeroSerie, numeroPatrimonial);
		return Optional.ofNullable(equipo)
			.map(result -> new ResponseEntity<>(
				result,
				HttpStatus.OK))
			.orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	@RequestMapping(value = "/filtro",
		method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public List<Equipo> getAllFilter(@RequestBody Equipo equipo)
	{
		if(equipo.getNumeroSerie().isEmpty() && !equipo.getNumeroPatrimonial().isEmpty()) {
			return equipoService.getEquiposByNumeroPatrimonialContains(equipo.getNumeroPatrimonial());
		} else if(!equipo.getNumeroSerie().isEmpty() && equipo.getNumeroPatrimonial().isEmpty()) {
			return equipoService.getEquiposByNumeroSerieContains(equipo.getNumeroSerie());
		}
		return equipoService.getEquiposByNumeroSerieContainsAndNumeroPatrimonialContains(
			equipo.getNumeroSerie(), equipo.getNumeroPatrimonial());
	}

	@RequestMapping(value = "/by-filter",
		method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public List<EquipoDTO> getByFilter(
		@RequestParam Map<String, String> customQuery)
	{
		return equipoService.getEquiposByFilter(customQuery);
	}


	/**
	 * Cambio de estado de un equipo
	 *
	 * @param equipoId el id correspondiente al equipo
	 * @param estado el estado al que se desea cambiar
	 * @return
	 * @throws URISyntaxException
	 */
	@RequestMapping(value= "/cambio-estado", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Equipo> cambioEstado(@RequestParam Long equipoId, @RequestParam String estado) throws URISyntaxException
	{
		Equipo result = equipoService.cambioEstado(equipoId, estado);
		return ResponseEntity.created(new URI("/api/equipos/cambio-estado" + result.getId()))
			.body(result);
	}

	/**
	 * Calculas las metricas dado el id de un equipo, una fecha de inicio y una fecha de fin para la busqueda.
	 * @param equipoId el id del equipo
	 * @param fechaInicio la fecha de inicio de la busqueda
	 * @param fechaFin la fecha de fin de la busqueda
	 * @return
	 */
	@RequestMapping(value = "metricas-by-equipo-and-fecha", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public MetricasDTO getMetricasByEquipoAndFechas(@RequestParam Long equipoId,
													@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
													@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin) {

		return equipoService.calculoMetricas(equipoId, fechaInicio, fechaFin);
	}

	/**
	 * Obtiene la lista de equipos con el último contrato
	 *
	 * @return equipos lista de equipos con el último contrato
	 */
	@RequestMapping(value = "/ultimo-contrato", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
	public List<EquipoDTO> findEquiposWithUltimoContrato()
	{
		return equipoService.findEquiposWithUltimoContrato();
	}
}
