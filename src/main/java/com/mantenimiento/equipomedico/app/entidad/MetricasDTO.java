package com.mantenimiento.equipomedico.app.entidad;

import java.io.Serializable;

public class MetricasDTO implements Serializable
{
	private static final long serialVersionUID = 1L;
	private Integer totalAverias;
	private Long mediaAverias;
	private Long totalHoursInactive;
	private Long totalHoursInstalacion;

	/**
	 * Gets totalAverias
	 *
	 * @return value of totalAverias
	 */
	public Integer getTotalAverias()
	{
		return totalAverias;
	}

	/**
	 * Set totalAverias
	 *
	 * @param totalAverias
	 */
	public void setTotalAverias(Integer totalAverias)
	{
		this.totalAverias = totalAverias;
	}

	/**
	 * Gets mediaAverias
	 *
	 * @return value of mediaAverias
	 */
	public Long getMediaAverias()
	{
		return mediaAverias;
	}

	/**
	 * Set mediaAverias
	 *
	 * @param mediaAverias
	 */
	public void setMediaAverias(Long mediaAverias)
	{
		this.mediaAverias = mediaAverias;
	}

	public Long getTotalHoursInactive() {
		return totalHoursInactive;
	}

	public Long getTotalHoursInstalacion() {
		return totalHoursInstalacion;
	}

	public void setTotalHoursInactive(Long totalHoursInactive) {
		this.totalHoursInactive = totalHoursInactive;
	}

	public void setTotalHoursInstalacion(Long totalHoursInstalacion) {
		this.totalHoursInstalacion = totalHoursInstalacion;
	}
}
