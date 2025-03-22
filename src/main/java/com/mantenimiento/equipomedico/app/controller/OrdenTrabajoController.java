package com.mantenimiento.equipomedico.app.controller;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import com.mantenimiento.equipomedico.app.entidad.OrdenTrabajo;
import com.mantenimiento.equipomedico.app.service.OrdenTrabajoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ordentrabajo")
public class OrdenTrabajoController
{

    @Autowired
    private OrdenTrabajoService ordenTrabajoService;

    public OrdenTrabajoController(OrdenTrabajoService ordenTrabajoService) {
        this.ordenTrabajoService = ordenTrabajoService;
    }

    /**
     * Creación de un nueva orden de trabajo
     *
     * @param orden
     * @return
     * @throws URISyntaxException
     */
    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<OrdenTrabajo> create(@RequestBody OrdenTrabajo orden) throws URISyntaxException {
        OrdenTrabajo result = ordenTrabajoService.create(orden);
        return ResponseEntity.created(new URI("/api/ordentrabajo/" + result.getId()))
                .body(result);
    }

    /**
     * Edición de una orden de trabajo existente.
     *
     * @param orden
     * @return
     * @throws URISyntaxException
     */
    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<OrdenTrabajo> update(@RequestBody OrdenTrabajo orden) throws URISyntaxException {
        OrdenTrabajo result = ordenTrabajoService.update(orden);
        return ResponseEntity.created(new URI("/api/ordentrabajo/" + result.getId()))
                .body(result);
    }

    /**
     * Obtiene la lista de orden de trabajo.
     *
     * @return lista de ordenes de trabajo.
     */
    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public List<OrdenTrabajo> getAll() {
        return ordenTrabajoService.getAll();
    }

    @RequestMapping(value = "/by-estado/{estado}",method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public List<OrdenTrabajo> getAllByEstado(@PathVariable String estado) {
        return ordenTrabajoService.getAllByEstadoEquals(estado);
    }

    @RequestMapping(value = "/orden-atendida",method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public List<OrdenTrabajo> getAllOrdenAtendidas() {
        return ordenTrabajoService.getAllOrdenAtendidas();
    }

    @RequestMapping(value = "orden-pendiente/by-Tipo/{tipo}",
        method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public List<OrdenTrabajo> getAllByTipoMantenimientoOrdenPendiente(@PathVariable String tipo) {
        return ordenTrabajoService.getAllByTipoServicioEquals(tipo,"OTP");
    }

    @RequestMapping(value = "orden-atendida/by-Tipo/{tipo}",
        method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public List<OrdenTrabajo> getAllByTipoMantenimientoOrdenAtendida(@PathVariable String tipo) {
        return ordenTrabajoService.getAllByTipoServicioEquals(tipo,"OTA");
    }

    /**
     * Obtiene determinada orden de trabajo.
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<OrdenTrabajo> get(@PathVariable Long id) {
        OrdenTrabajo orden = ordenTrabajoService.get(id);
        return Optional.ofNullable(orden)
                .map(result -> new ResponseEntity<>(
                        result,
                        HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @RequestMapping(value = "by-equipo/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public List<OrdenTrabajo> getAllByEquipoId(@PathVariable Long id) {
        return ordenTrabajoService.getAllByEquipoId(id);
    }

}
