package com.mantenimiento.equipomedico.app.entidad;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;

/**
 * EquipoDTO
 *
 * @author Brenda Quiñonez
 */
public class EquipoDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long idEquipo;
    private String numeroSerie;
    private String numeroPatrimonial;
    private String estadoEquipo;
    private String descripcionEquipo;
    private Float costo;
    private String versionSw;
    private String tipoEquipo;
    private String representanteEquipo;
    private String marca;
    private String modelo;
    private String bloque;
    private String numeroSala;
    private String nivel;
    private Long contratoId;
    private String estadoContrato;
    private Date fechaVenGarantia;
    private String fechaFabricacion;
    private Date fechaInstalacion;
    private Date fechaCompra;

    public Long getIdEquipo() {
        return idEquipo;
    }

    public void setIdEquipo(Long idEquipo) {
        this.idEquipo = idEquipo;
    }

    public String getNumeroSerie() {
        return numeroSerie;
    }

    public void setNumeroSerie(String numeroSerie) {
        this.numeroSerie = numeroSerie;
    }

    public String getNumeroPatrimonial() {
        return numeroPatrimonial;
    }

    public void setNumeroPatrimonial(String numeroPatrimonial) {
        this.numeroPatrimonial = numeroPatrimonial;
    }

    public String getEstadoEquipo() {
        return estadoEquipo;
    }

    public void setEstadoEquipo(String estadoEquipo) {
        this.estadoEquipo = estadoEquipo;
    }

    public String getDescripcionEquipo() {
        return descripcionEquipo;
    }

    public void setDescripcionEquipo(String descripcionEquipo) {
        this.descripcionEquipo = descripcionEquipo;
    }

    public String getTipoEquipo() {
        return tipoEquipo;
    }

    public void setTipoEquipo(String tipoEquipo) {
        this.tipoEquipo = tipoEquipo;
    }

    public String getRepresentanteEquipo() {
        return representanteEquipo;
    }

    public void setRepresentanteEquipo(String representanteEquipo) {
        this.representanteEquipo = representanteEquipo;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getBloque() {
        return bloque;
    }

    public void setBloque(String bloque) {
        this.bloque = bloque;
    }

    public String getNumeroSala() {
        return numeroSala;
    }

    public void setNumeroSala(String numeroSala) {
        this.numeroSala = numeroSala;
    }

    public String getNivel() {
        return nivel;
    }

    public void setNivel(String nivel) {
        this.nivel = nivel;
    }

    public Long getContratoId() {
        return contratoId;
    }

    public void setContratoId(Long contratoId) {
        this.contratoId = contratoId;
    }

    public String getEstadoContrato() {
        return estadoContrato;
    }

    public void setEstadoContrato(String estadoContrato) {
        this.estadoContrato = estadoContrato;
    }

    public Date getFechaVenGarantia() {
        return fechaVenGarantia;
    }

    public void setFechaVenGarantia(Date fechaVenGarantia) {
        this.fechaVenGarantia = fechaVenGarantia;
    }

    public Float getCosto()
    {
        return costo;
    }

    public void setCosto(Float costo)
    {
        this.costo = costo;
    }

    public String getVersionSw()
    {
        return versionSw;
    }

    public void setVersionSw(String versionSw)
    {
        this.versionSw = versionSw;
    }

    public String getFechaFabricacion()
    {
        return fechaFabricacion;
    }

    public void setFechaFabricacion(String fechaFabricacion)
    {
        this.fechaFabricacion = fechaFabricacion;
    }

    public Date getFechaInstalacion()
    {
        return fechaInstalacion;
    }

    public void setFechaInstalacion(Date fechaInstalacion)
    {
        this.fechaInstalacion = fechaInstalacion;
    }

    public Date getFechaCompra()
    {
        return fechaCompra;
    }

    public void setFechaCompra(Date fechaCompra)
    {
        this.fechaCompra = fechaCompra;
    }
}
