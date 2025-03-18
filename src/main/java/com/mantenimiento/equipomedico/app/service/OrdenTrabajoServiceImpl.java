package com.mantenimiento.equipomedico.app.service;

import com.mantenimiento.equipomedico.app.entidad.OrdenTrabajo;
import com.mantenimiento.equipomedico.app.repository.OrdenTrabajoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrdenTrabajoServiceImpl implements OrdenTrabajoService {

    @Autowired
    private OrdenTrabajoRepository ordenTrabajoRepository;

    /**
     * Creación de una nueva orden de trabajo.
     *
     * @param ordenTrabajo
     * @return
     */
    @Override
    public OrdenTrabajo create(OrdenTrabajo ordenTrabajo) {
        return ordenTrabajoRepository.save(ordenTrabajo);
    }

    /**
     * Edición de una orden de Trabajo existente.
     *
     * @param ordenTrabajo
     * @return
     */
    @Override
    public OrdenTrabajo update(OrdenTrabajo ordenTrabajo) {
        return ordenTrabajoRepository.save(ordenTrabajo);
    }

    /**
     * Obtiene el orden de trabajo mediante su id.
     *
     * @param id
     * @return
     */
    @Override
    public OrdenTrabajo get(Long id) {
        Optional<OrdenTrabajo> entity = ordenTrabajoRepository.findById(id);
        return entity.orElse(null);
    }

    /**
     * Obtiene todos las ordenes de trabajo.
     *
     * @return
     */
    @Override
    public List<OrdenTrabajo> getAll() {
        return (ArrayList<OrdenTrabajo>) ordenTrabajoRepository.findAll();
    }

    @Override
    public List<OrdenTrabajo> getAllByEstadoEquals(String estado)
    {
        return ordenTrabajoRepository.getAllByEstadoEquals(estado);
    }

    @Override
    public List<OrdenTrabajo> getAllByTipoServicioEquals(String tipoServicio,String tipoOrdenTrabajoVista)
    {
        // Orden de trabajos Pendientes (OTP)
        if(tipoOrdenTrabajoVista.equals("OTP")) {
            return ordenTrabajoRepository.getAllByTipoServicioAndEstadoEquals(tipoServicio, "Pendiente");
        }
        return ordenTrabajoRepository.getAllByTipoServicioAndEstadoBetween(tipoServicio,"En Proceso", "Finalizada");
    }

    @Override
    public List<OrdenTrabajo> getAllByEquipoId(Long id)
    {
        return ordenTrabajoRepository.getAllByEquipoId(id);
    }
}
