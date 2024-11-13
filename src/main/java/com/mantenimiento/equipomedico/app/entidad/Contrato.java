package com.mantenimiento.equipomedico.app.entidad;


import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * Contrato
 *
 * @author Brenda Quiñonez
 *
 */
@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@Table(name = "contrato")
public class Contrato implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "numero_contrato")
    private String numeroContrato;

    @Column(name = "nombre_licitacion")
    private String nombreLicitacion;

    @Column(name = "tipo_procedimiento")
    private String tipoProcedimiento;

    @Column(name = "estado_contrato")
    private String estadoContrato;

    @Column(name = "fecha_inicio")
    private Date fechaInicio;

    @Column(name = "fecha_fin")
    private Date fechaFin;


    @ManyToMany
    @JoinTable(
        name = "contrato_equipo",
        joinColumns = @JoinColumn(name = "contrato_id", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "equipo_id", referencedColumnName = "id"))
    private List<Equipo> equipos;

    @ManyToMany
    @JoinTable(
        name = "contrato_repuesto",
        joinColumns = @JoinColumn(name = "contrato_id", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "repuesto_id", referencedColumnName = "id"))
    private List<Repuesto> repuestos;

    @Column(name = "convocante")
    private String convocante;

    @Column(name = "pdf")
    private String pdf;

    @Column(name = "numero_procedimiento")
    private String numeroProcedimiento;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "representante_id")
    private Representante representante;

    @Column(name = "tipo_contratp")
    private String tipoContrato;


    /**
     * Gets nombreLicitacion
     *
     * @return value of nombreLicitacion
     */
    public String getNombreLicitacion() {
        return nombreLicitacion;
    }

    /**
     * Set nombreLicitacion
     *
     * @param nombreLicitacion
     */
    public void setNombreLicitacion(String nombreLicitacion) {
        this.nombreLicitacion = nombreLicitacion;
    }

    /**
     * Gets tipoProcedimiento
     *
     * @return value of tipoProcedimiento
     */
    public String getTipoProcedimiento() {
        return tipoProcedimiento;
    }

    /**
     * Set tipoProcedimiento
     *
     * @param tipoProcedimiento
     */
    public void setTipoProcedimiento(String tipoProcedimiento) {
        this.tipoProcedimiento = tipoProcedimiento;
    }

    /**
     * Gets estadoContrato
     *
     * @return value of estadoContrato
     */
    public String getEstadoContrato() {
        return estadoContrato;
    }

    /**
     * Set estadoContrato
     *
     * @param estadoContrato
     */
    public void setEstadoContrato(String estadoContrato) {
        this.estadoContrato = estadoContrato;
    }

    /**
     * Gets fechaInicio
     *
     * @return value of fechaInicio
     */
    public Date getFechaInicio() {
        return fechaInicio;
    }

    /**
     * Set fechaInicio
     *
     * @param fechaInicio
     */
    public void setFechaInicio(Date fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    /**
     * Gets fechaFin
     *
     * @return value of fechaFin
     */
    public Date getFechaFin() {
        return fechaFin;
    }

    /**
     * Set fechaFin
     *
     * @param fechaFin
     */
    public void setFechaFin(Date fechaFin) {
        this.fechaFin = fechaFin;
    }

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
     * Gets equipos
     *
     * @return value of equipos
     */
    public List<Equipo> getEquipos() {
        return equipos;
    }

    /**
     * Set equipos
     *
     * @param equipos
     */
    public void setEquipos(List<Equipo> equipos) {
        this.equipos = equipos;
    }

    /**
     * Gets convocante
     *
     * @return value of convocante
     */
    public String getConvocante() {
        return convocante;
    }

    /**
     * Set convocante
     *
     * @param convocante
     */
    public void setConvocante(String convocante) {
        this.convocante = convocante;
    }

    /**
     * Gets pdf
     *
     * @return value of pdf
     */
    public String getPdf() {
        return pdf;
    }

    /**
     * Set pdf
     *
     * @param pdf
     */
    public void setPdf(String pdf) {
        this.pdf = pdf;
    }

    /**
     * Gets numeroContrato
     *
     * @return value of numeroContrato
     */
    public String getNumeroContrato()
    {
        return numeroContrato;
    }

    /**
     * Set numeroContrato
     *
     * @param numeroContrato
     */
    public void setNumeroContrato(String numeroContrato)
    {
        this.numeroContrato = numeroContrato;
    }

    /**
     * Gets numeroProcedimiento
     *
     * @return value of numeroProcedimiento
     */
    public String getNumeroProcedimiento()
    {
        return numeroProcedimiento;
    }

    /**
     * Set numeroProcedimiento
     *
     * @param numeroProcedimiento
     */
    public void setNumeroProcedimiento(String numeroProcedimiento)
    {
        this.numeroProcedimiento = numeroProcedimiento;
    }

    /**
     * Gets representante
     *
     * @return value of representante
     */
    public Representante getRepresentante()
    {
        return representante;
    }

    /**
     * Set representante
     *
     * @param representante
     */
    public void setRepresentante(Representante representante)
    {
        this.representante = representante;
    }

    /**
     * Gets tipoContrato
     *
     * @return value of tipoContrato
     */
    public String getTipoContrato()
    {
        return tipoContrato;
    }

    /**
     * Set tipoContrato
     *
     * @param tipoContrato
     */
    public void setTipoContrato(String tipoContrato)
    {
        this.tipoContrato = tipoContrato;
    }

    /**
     * Gets repuestos
     *
     * @return value of repuestos
     */
    public List<Repuesto> getRepuestos()
    {
        return repuestos;
    }

    /**
     * Set repuestos
     *
     * @param repuestos
     */
    public void setRepuestos(List<Repuesto> repuestos)
    {
        this.repuestos = repuestos;
    }
}
