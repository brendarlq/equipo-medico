package com.mantenimiento.equipomedico.app.service;

import com.mantenimiento.equipomedico.app.entidad.OrdenTrabajo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface OrdenTrabajoService {

    /**
     * Creación de una nueva orden de trabajo.
     *
     * @param ordenTrabajo
     * @return
     */
    OrdenTrabajo create(OrdenTrabajo ordenTrabajo);

    /**
     * Edición de una orden de trabajo existente.
     *
     * @param ordenTrabajo
     * @return
     */
    OrdenTrabajo update(OrdenTrabajo ordenTrabajo);

    /**
     * Obtiene la orden de trabajo mediante su id.
     *
     * @param id
     * @return
     */
    OrdenTrabajo get(Long id);

    /**
     * Obtiene todas las ordenes de trabajo.
     *
     * @return
     */
    List<OrdenTrabajo> getAll();
    List<OrdenTrabajo> getAllOrdenAtendidas();
    List<OrdenTrabajo> getAllByEstadoEquals(String estado);
    List<OrdenTrabajo> getAllByTipoServicioEquals(String tipoServicio,String tipoOrdenTrabajoVista);

    List<OrdenTrabajo> getAllByEquipoId(Long id);

}
