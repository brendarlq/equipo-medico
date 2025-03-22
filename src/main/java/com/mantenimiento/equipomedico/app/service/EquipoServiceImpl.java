package com.mantenimiento.equipomedico.app.service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

import com.mantenimiento.equipomedico.app.entidad.*;
import com.mantenimiento.equipomedico.app.repository.EquipoRepository;
import com.mantenimiento.equipomedico.app.repository.RegistroEstadosEquipoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EquipoServiceImpl implements EquipoService {

    @Autowired
    private EquipoRepository equipoRepository;

    @Autowired
    private RegistroEstadosEquipoRepository registroEstadosEquipoRepository;


    /**
     * Creación de un nuevo equipo.
     *
     * @param equipo
     * @return
     */
    @Override
    public Equipo create(Equipo equipo) {
        return equipoRepository.save(equipo);
    }

    /**
     * Obtiene el equipo mediante su id.
     *
     * @param id
     * @return
     */
    @Override
    public Equipo get(Long id) {
        Optional<Equipo> entity = equipoRepository.findById(id);
        return entity.orElse(null);
    }

    @Override
    public EquipoDTO getEquipoDTO(Long id)
    {
        Equipo equipo = get(id);
        return transformEquipoDTO(equipo);
    }

    /**
     * Obtiene todos los equipos.
     *
     * @return
     */
    @Override
    public List<Equipo> getAll() {
        return (ArrayList<Equipo>) equipoRepository.findAll();
    }

    /**
     * Obtiene todos los equipos sin contrato
     *
     * @return
     */
    @Override
    public List<Equipo> getSinContrato() {
        return equipoRepository.findAllByContratos_Empty();
    }

    /**
     * Obtiene todos los equipos con último contrato
     *
     * @return
     */
    @Override
    public List<EquipoDTO> findEquiposWithUltimoContrato() {
        // Obtener todos los equipos con sus contratos
        List<Equipo> equipos = (ArrayList<Equipo>) equipoRepository.findAll();

        // Filtrar los contratos para que cada equipo tenga solo el último contrato
        equipos.forEach(equipo -> {
            // Filtra el contrato más reciente en la lista de contratos del equipo
            equipo.setContratos(
                    equipo.getContratos().stream()
                            .max(Comparator.comparing(Contrato::getFechaInicio))
                            .map(contrato -> new ArrayList<>(Collections.singletonList(contrato)))  // Convierte el contrato en una lista
                            .orElse(new ArrayList<>())  // Si no hay contratos, regresa una lista vacía
            );
        });

        return transformEquipoDTO(equipos);
    }

    /**
     * Obtiene el equipo mediante su numero patrimonial.
     *
     * @param numeroPatrimonial
     * @return
     */
    @Override
    public EquipoDTO getByNumeroPatrimonialAndEstadoEquals(String numeroPatrimonial, String estado) {
        Equipo result = equipoRepository.getEquipoByNumeroPatrimonialAndEstadoEquals(numeroPatrimonial, estado);
        return transformEquipoDTO(result);
    }

    /**
     * Obtiene el equipo mediante su numero de serie.
     *
     * @param numeroSerie
     * @return
     */
    @Override
    public EquipoDTO getByNumeroSerieEquals(String numeroSerie) {
        Equipo result = equipoRepository.getEquipoByNumeroSerieEquals(numeroSerie);
        return transformEquipoDTO(result);
    }

    @Override
    public EquipoDTO getEquiposByNumeroSerieAndNumeroPatrimonialEquals(String numeroSerie, String numeroPatrimonial) {
        Equipo result = equipoRepository.getEquiposByNumeroSerieAndNumeroPatrimonialEquals(numeroSerie, numeroPatrimonial);
        return transformEquipoDTO(result);
    }

    @Override
    public List<Equipo> getEquiposByNumeroSerieContains(String numeroSerie) {
        return equipoRepository.getEquiposByNumeroSerieContains(numeroSerie);
    }

    @Override
    public List<Equipo> getEquiposByNumeroPatrimonialContains(String numeroPatrimonial) {
        return equipoRepository.getEquiposByNumeroPatrimonialContains(numeroPatrimonial);
    }

    @Override
    public List<Equipo> getEquiposByNumeroSerieContainsAndNumeroPatrimonialContains(
            String numeroSerie, String numeroPatrimonial) {
        return equipoRepository.getEquiposByNumeroSerieContainsAndNumeroPatrimonialContains(
                numeroSerie, numeroPatrimonial);
    }

    @Override
    public List<EquipoDTO> getEquiposByFilter(Map<String, String> customQuery) {
        String tipo = null;
        String marca = null;
        String modelo = null;
        String bloque = null;

        String estadoEquipo = null;
        String estadoContrato = null;
        if (customQuery.containsKey("tipo")) {
            customQuery.get("tipo");
        }
        if (customQuery.containsKey("tipo")) {
            tipo = customQuery.get("tipo");
        }
        if (customQuery.containsKey("marca")) {
            marca = customQuery.get("marca");
        }
        if (customQuery.containsKey("modelo")) {
            modelo = customQuery.get("modelo");
        }
        if (customQuery.containsKey("bloque")) {
            bloque = customQuery.get("bloque");
        }
        if (customQuery.containsKey("estadoEquipo")) {
            estadoEquipo = customQuery.get("estadoEquipo");
        }
        if (customQuery.containsKey("estadoContrato")) {
            estadoContrato = customQuery.get("estadoContrato");
        }

        List<Equipo> equipos = equipoRepository.getEquiposByFilter(tipo, marca, modelo, bloque, estadoEquipo, estadoContrato);
        return transformEquipoDTO(equipos);
    }

    @Override
    public Equipo cambioEstado(Long id, String estado) {
        Equipo equipo = equipoRepository.getById(id);
        equipo.setEstado(estado);

        LocalDateTime fechaActual = LocalDateTime.now();

        RegistroEstadosEquipo ultimoRegistro = registroEstadosEquipoRepository.getRegistroEstadosEquipoByEquipoIdAndFechaFinIsNull(id);
        if (Objects.nonNull(ultimoRegistro)) {
            ultimoRegistro.setFechaFin(fechaActual);
            registroEstadosEquipoRepository.save(ultimoRegistro);
        }

        RegistroEstadosEquipo registroEstadosEquipo = new RegistroEstadosEquipo();
        registroEstadosEquipo.setEquipoId(id);
        registroEstadosEquipo.setEstado(estado);
        registroEstadosEquipo.setFechaInicio(fechaActual);
        registroEstadosEquipo.setFechaFin(null);
        registroEstadosEquipoRepository.save(registroEstadosEquipo);

        return equipoRepository.save(equipo);
    }


    public MetricasDTO calculoMetricas(Long equipoId, Date fechaInicio, Date fechaFin) {

        List<RegistroEstadosEquipo> registroEstadosEquipoList = registroEstadosEquipoRepository.getAllByEquipoIdAAndFechaInicioBetween(equipoId, fechaInicio, fechaFin);
        registroEstadosEquipoList.sort(Comparator.comparing(RegistroEstadosEquipo::getFechaInicio));

        List<RegistroEstadosEquipo> registrosInoperativosList = registroEstadosEquipoList.stream().filter(f -> f.getEstado().equals("Inoperativo")).collect(
                Collectors.toList());

        registrosInoperativosList.sort(Comparator.comparing(RegistroEstadosEquipo::getFechaInicio));
        Integer totalAverias = registrosInoperativosList.size();

        int i = 0;
        Long totalDays = Long.valueOf(0);
        Long mediaAverias = Long.valueOf(0);
        if (!registrosInoperativosList.isEmpty() && registrosInoperativosList.size() > 1) {
            while (i < registrosInoperativosList.size() - 1) {
                LocalDateTime dateBefore = registrosInoperativosList.get(i).getFechaInicio();
                LocalDateTime dateAfter = registrosInoperativosList.get(i + 1).getFechaInicio();
                Long noOfDaysBetween = ChronoUnit.DAYS.between(dateBefore, dateAfter);
                i++;
                totalDays = totalDays + noOfDaysBetween;
            }
            mediaAverias = totalDays / i;
        }

        //ponemos el ultimo elemento de la lista con fecha actual
        registroEstadosEquipoList.get(registroEstadosEquipoList.size() - 1).setFechaFin(LocalDateTime.now());

        Long totalDaysInactive = Long.valueOf(0);
        if (!registrosInoperativosList.isEmpty()) {
            for (int j = 0; j < registroEstadosEquipoList.size() - 1; j++) {
                if ("Inoperativo".equals(registroEstadosEquipoList.get(j).getEstado())) {
                    LocalDateTime dateBefore = registroEstadosEquipoList.get(j).getFechaInicio();
                    LocalDateTime dateAfter = registroEstadosEquipoList.get(j + 1).getFechaInicio();
                    Long noOfDaysBetween = ChronoUnit.DAYS.between(dateBefore, dateAfter);
                    totalDaysInactive = totalDaysInactive + noOfDaysBetween;
                }
            }
        }

        MetricasDTO metricasDTO = new MetricasDTO();
        metricasDTO.setTotalAverias(totalAverias);
        metricasDTO.setMediaAverias(mediaAverias);
        metricasDTO.setTotalDaysInactive(totalDaysInactive);
        metricasDTO.setTotalDaysInstalacion(ChronoUnit.DAYS.between
                (registroEstadosEquipoList.get(0).getFechaInicio(), (LocalDateTime.now())));

        return metricasDTO;
    }

    public List<EquipoDTO> transformEquipoDTO(List<Equipo> equipoList) {
        List<EquipoDTO> equipoDTOList = new ArrayList<>();
        for (Equipo equipo : equipoList) {
            equipoDTOList.add(transformEquipoDTO(equipo));
        }
        return equipoDTOList;
    }

    public EquipoDTO transformEquipoDTO(Equipo equipo) {
        EquipoDTO equipoDTO = new EquipoDTO();
        equipoDTO.setIdEquipo(equipo.getId());
        equipoDTO.setNumeroSerie(equipo.getNumeroSerie());
        equipoDTO.setNumeroPatrimonial(equipo.getNumeroPatrimonial());
        equipoDTO.setEstadoEquipo(equipo.getEstado());
        equipoDTO.setDescripcionEquipo(equipo.getDescripcionEquipo());
        equipoDTO.setCosto(equipo.getCosto());
        equipoDTO.setVersionSw(equipo.getVersionSw());

        equipoDTO.setTipoEquipo(equipo.getTipoEquipo()!= null?equipo.getTipoEquipo().getTipo():"");
        equipoDTO.setMarca(equipo.getMarca() != null?equipo.getMarca().getMarca():"");
        equipoDTO.setModelo(equipo.getModelo() != null?equipo.getModelo().getModelo():"");
        equipoDTO.setRepresentanteEquipo(equipo.getRepresentante() != null?equipo.getRepresentante().getNombre():"");

        if(equipo.getUbicacion()!= null) {
            equipoDTO.setBloque(equipo.getUbicacion().getBloque());
            equipoDTO.setNumeroSala(equipo.getUbicacion().getNumeroSala());
            equipoDTO.setNivel(equipo.getUbicacion().getNivel());
        }
        if(equipo.getContratos()!= null && equipo.getContratos().size() > 0) {
            equipoDTO.setContratoId(equipo.getContratos().get(0).getId());
            equipoDTO.setEstadoContrato(equipo.getContratos().get(0).getEstadoContrato());
        }
        equipoDTO.setFechaCompra(equipo.getFechaCompra());
        equipoDTO.setFechaFabricacion(equipo.getFechaFabricacion());
        equipoDTO.setFechaInstalacion(equipo.getFechaInstalacion());
        equipoDTO.setFechaVenGarantia(equipo.getFechaVenGarantia());
        return equipoDTO;
    }
}
