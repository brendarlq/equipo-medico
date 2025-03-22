package com.mantenimiento.equipomedico.app.repository;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import com.mantenimiento.equipomedico.app.entidad.Equipo;

public class EquipoRepositoryCustomImpl implements EquipoRepositoryCustom
{
	@PersistenceContext
	private EntityManager entityManager;

	@Override
	public List<Equipo> getEquiposByFilter(
		String tipo, String marca, String modelo, String bloque, String estadoEquipo, String estadoContrato)
	{
		CriteriaBuilder cb = entityManager.getCriteriaBuilder();
		CriteriaQuery<Equipo> query = cb.createQuery(Equipo.class);
		Root<Equipo> equipoRoot = query.from(Equipo.class);

		List<Predicate> predicates = new ArrayList<>();
		if(tipo != null) {
			predicates.add(cb.equal(equipoRoot.join("tipoEquipo").get("tipo"), tipo));
		}
		if(marca != null) {
			predicates.add(cb.equal(equipoRoot.join("marca").get("marca"), marca));
		}
		if(modelo != null) {
			predicates.add(cb.equal(equipoRoot.join("modelo").get("modelo"), modelo));
		}
		if(bloque != null) {
			predicates.add(cb.equal(equipoRoot.join("ubicacion").get("bloque"), bloque));
		}
		if(estadoEquipo != null) {
			predicates.add(cb.equal(equipoRoot.get("estado"), estadoEquipo));
		}
		if(estadoContrato != null) {
			predicates.add(cb.equal(equipoRoot.join("contratos")
				.get("estadoContrato"), estadoContrato));
		}
		if(predicates.isEmpty()) {
			query.select(equipoRoot);
		} else {
			query.select(equipoRoot).where(cb.or(predicates.toArray(new Predicate[predicates.size()])));
		}
		return entityManager.createQuery(query).getResultList();
	}
}
