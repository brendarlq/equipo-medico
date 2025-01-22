package com.mantenimiento.equipomedico.app.entidad;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

/**
 * Orden de trabajo para el equipo.
 *
 * @author Brenda Quiñonez
 *
 */
@Entity
@Table(name = "orden_trabajo")
public class OrdenTrabajo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    @Column(name = "id")
    private Long id;

    @Column(name = "estado")
    private String estado;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "equipo_id")
    private Equipo equipo;

    @Column(name = "tipo_servicio")
    private String tipoServicio;

    @Column(name = "diagnostico")
    private String diagnostico;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @OneToOne()
    @JoinColumn(name="solicitud_repuesto_id")
    private SolicitudRepuesto solicitudRepuesto;

    @OneToMany(mappedBy="ordenTrabajo")
    @JsonManagedReference
    private List<Mantenimiento> mantenimientos;

    // Para el tipo de servicio PREVENTIVO
    @Column(name = "fechaSolicitud")
    private Date fechaSolicitud;

    @Column(name= "responsable")
   private String responsable;

    /**
     * Gets id
     *
     * @return value of id
     */
    public Long getId()
    {
        return id;
    }

    /**
     * Set id
     *
     * @param id
     */
    public void setId(Long id)
    {
        this.id = id;
    }


    /**
     * Gets estado
     *
     * @return value of estado
     */
    public String getEstado()
    {
        return estado;
    }

    /**
     * Set estado
     *
     * @param estado
     */
    public void setEstado(String estado)
    {
        this.estado = estado;
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
     * Gets diagnostico
     *
     * @return value of diagnostico
     */
    public String getDiagnostico()
    {
        return diagnostico;
    }

    /**
     * Set diagnostico
     *
     * @param diagnostico
     */
    public void setDiagnostico(String diagnostico)
    {
        this.diagnostico = diagnostico;
    }

    /**
     * Gets solicitudRepuesto
     *
     * @return value of solicitudRepuesto
     */
    public SolicitudRepuesto getSolicitudRepuesto()
    {
        return solicitudRepuesto;
    }

    /**
     * Set solicitudRepuesto
     *
     * @param solicitudRepuesto
     */
    public void setSolicitudRepuesto(SolicitudRepuesto solicitudRepuesto)
    {
        this.solicitudRepuesto = solicitudRepuesto;
    }

    /**
     * Gets fechaSolicitud
     *
     * @return value of fechaSolicitud
     */
    public Date getFechaSolicitud()
    {
        return fechaSolicitud;
    }

    /**
     * Set fechaSolicitud
     *
     * @param fechaSolicitud
     */
    public void setFechaSolicitud(Date fechaSolicitud)
    {
        this.fechaSolicitud = fechaSolicitud;
    }

    /**
     * Gets responsable
     *
     * @return value of responsable
     */
    public String getResponsable()
    {
        return responsable;
    }

    /**
     * Set responsable
     *
     * @param responsable
     */
    public void setResponsable(String responsable)
    {
        this.responsable = responsable;
    }

    /**
     * Gets equipo
     *
     * @return value of equipo
     */
    public Equipo getEquipo()
    {
        return equipo;
    }

    /**
     * Set equipo
     *
     * @param equipo
     */
    public void setEquipo(Equipo equipo)
    {
        this.equipo = equipo;
    }

    /**
     * Gets mantenimientos
     *
     * @return value of mantenimientos
     */
    public List<Mantenimiento> getMantenimientos()
    {
        return mantenimientos;
    }

    /**
     * Set mantenimientos
     *
     * @param mantenimientos
     */
    public void setMantenimientos(List<Mantenimiento> mantenimientos)
    {
        this.mantenimientos = mantenimientos;
    }
}
