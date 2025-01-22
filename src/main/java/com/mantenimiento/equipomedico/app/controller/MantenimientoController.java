package com.mantenimiento.equipomedico.app.controller;

import com.mantenimiento.equipomedico.app.entidad.Mantenimiento;
import com.mantenimiento.equipomedico.app.entidad.OrdenTrabajo;
import com.mantenimiento.equipomedico.app.entidad.Repuesto;
import com.mantenimiento.equipomedico.app.entidad.SolicitudRepuestoDetalles;
import com.mantenimiento.equipomedico.app.service.MantenimientoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/mantenimientos")
public class MantenimientoController {

    @Autowired
    private MantenimientoService mantenimientoService;

    public MantenimientoController(MantenimientoService mantenimientoService) {
        this.mantenimientoService = mantenimientoService;
    }

    /**
     * Creación de un nuevo mantenimiento.
     *
     * @param mantenimiento
     * @return
     * @throws URISyntaxException
     */
    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Mantenimiento> create(@RequestBody Mantenimiento mantenimiento) throws URISyntaxException {
        Mantenimiento result = mantenimientoService.create(mantenimiento);
        return ResponseEntity.created(new URI("/api/mantenimientos/" + result.getId()))
                .body(result);
    }

    /**
     * Edición de un mantenimiento existente.
     *
     * @param mantenimiento
     * @return
     * @throws URISyntaxException
     */
    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Mantenimiento> update(@RequestBody Mantenimiento mantenimiento) throws URISyntaxException {
        Mantenimiento result = mantenimientoService.update(mantenimiento);
        return ResponseEntity.created(new URI("/api/mantenimientos/" + result.getId()))
                .body(result);
    }

    /**
     * Obtiene la lista de mantenimiento.
     *
     * @return mantenimiento lista de mantenimiento.
     */
    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Mantenimiento> getAll() {
        return mantenimientoService.getAll();
    }

    /**
     * Obtiene determinado mantenimiento.
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Mantenimiento> get(@PathVariable Long id) {
        Mantenimiento mantenimiento = mantenimientoService.get(id);
        return Optional.ofNullable(mantenimiento)
                .map(result -> new ResponseEntity<>(
                        result,
                        HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @RequestMapping(value = "by-equipo-and-fecha", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Mantenimiento> getAllByEquipoIdAndFecha(@RequestParam Long id,
        @RequestParam Date fechaInicio, @RequestParam Date fechaFin) {
        return mantenimientoService.getAllByEquipoIdAndFecha(id, fechaInicio, fechaFin);
    }

    @RequestMapping(value = "by-equipo", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Mantenimiento> getAllByEquipoId(@RequestParam Long id) {
        return mantenimientoService.getAllByEquipoId(id);
    }

    /**
     * Elimina un detalle de solicitud de repuesto.
     *
     * @param id
     * @return
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Mantenimiento> removeMantenimientoById(@PathVariable("id") Long id)
    {
        mantenimientoService.removeById(id);
        return ResponseEntity.noContent().build();
    }
}
