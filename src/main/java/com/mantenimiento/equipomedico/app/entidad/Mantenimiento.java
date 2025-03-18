package com.mantenimiento.equipomedico.app.entidad;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

/**
 * Registro del mantenimiento.
 * Registro del servicio
 * @author Brenda Quiñonez
 *
 */
@Entity
@Table(name = "mantenimiento")
public class Mantenimiento implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    @Column(name = "id")
    private Long id;

    @Column(name = "horas_de_uso")
    private Integer horasDeUso;
    @Column(name = "fecha_manteniminento")
    private Date fechaMantenimiento;

    @Column(name = "tarea_realizada")
    private String tareaRealizada;

    @Column(name = "codigo_error")
    private String CodigoError;

    @Column(name = "nombre_tecnico")
    private String nombreTecnico;

    @Column(name = "tipo_servicio")
    private String tipoServicio;

    @Column(name = "estado")
    private String estadoEquipo;

    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "orden_trabajo_id")
    @JsonBackReference
    private OrdenTrabajo ordenTrabajo;

    /**
     * Gets id
     *
     * @return value of id
     */
    public Long getId() {
        return id;
    }

    /**
     * Set id
     *
     * @param id
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * Gets fechaMantenimiento
     *
     * @return value of fechaMantenimiento
     */
    public Date getFechaMantenimiento() {
        return fechaMantenimiento;
    }

    /**
     * Set fechaMantenimiento
     *
     * @param fechaMantenimiento
     */
    public void setFechaMantenimiento(Date fechaMantenimiento) {
        this.fechaMantenimiento = fechaMantenimiento;
    }

    /**
     * Gets tareaRealizada
     *
     * @return value of tareaRealizada
     */
    public String getTareaRealizada() {
        return tareaRealizada;
    }

    /**
     * Set tareaRealizada
     *
     * @param tareaRealizada
     */
    public void setTareaRealizada(String tareaRealizada) {
        this.tareaRealizada = tareaRealizada;
    }


    /**
     * Gets nombreTecnico
     *
     * @return value of nombreTecnico
     */
    public String getNombreTecnico() {
        return nombreTecnico;
    }

    /**
     * Set nombreTecnico
     *
     * @param nombreTecnico
     */
    public void setNombreTecnico(String nombreTecnico) {
        this.nombreTecnico = nombreTecnico;
    }

    /**
     * Gets tipoServicio
     *
     * @return value of tipoServicio
     */
    public String getTipoServicio()
    {
        return tipoServicio;
    }

    /**
     * Set tipoServicio
     *
     * @param tipoServicio
     */
    public void setTipoServicio(String tipoServicio)
    {
        this.tipoServicio = tipoServicio;
    }

    /**
     * Gets estadoEquipo
     *
     * @return value of estadoEquipo
     */
    public String getEstadoEquipo()
    {
        return estadoEquipo;
    }

    /**
     * Set estadoEquipo
     *
     * @param estadoEquipo
     */
    public void setEstadoEquipo(String estadoEquipo)
    {
        this.estadoEquipo = estadoEquipo;
    }

    /**
     * Set ordenTrabajo
     *
     * @param ordenTrabajo
     */
    public void setOrdenTrabajo(OrdenTrabajo ordenTrabajo)
    {
        this.ordenTrabajo = ordenTrabajo;
    }

    /**
     * Gets ordenTrabajo
     *
     * @return value of ordenTrabajo
     */
    public OrdenTrabajo getOrdenTrabajo()
    {
        return ordenTrabajo;
    }

    public Integer getHorasDeUso()
    {
        return horasDeUso;
    }

    public void setHorasDeUso(Integer horasDeUso)
    {
        this.horasDeUso = horasDeUso;
    }

    public String getCodigoError()
    {
        return CodigoError;
    }

    public void setCodigoError(String codigoError)
    {
        CodigoError = codigoError;
    }
}
