package com.mantenimiento.equipomedico.app.service;

import com.mantenimiento.equipomedico.app.entidad.Mantenimiento;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public interface MantenimientoService {

    /**
     * Creación de un nuevo mantenimiento.
     *
     * @param mantenimiento
     * @return
     */
    Mantenimiento create(Mantenimiento mantenimiento);

    /**
     * Edición de un mantenimiento existente.
     *
     * @param mantenimiento
     * @return
     */
    Mantenimiento update(Mantenimiento mantenimiento);

    /**
     * Obtiene el mantenimiento mediante su id.
     *
     * @param id
     * @return
     */
    Mantenimiento get(Long id);

    /**
     * Obtiene todos los mantenimientos.
     *
     * @return
     */
    List<Mantenimiento> getAll();

    List<Mantenimiento> getAllByEquipoIdAndFecha(Long id, Date fechaInicio, Date fechaFin);

    List<Mantenimiento> getAllByEquipoId(Long equipoId);

    void removeById(long id);
}
