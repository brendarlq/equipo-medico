package com.mantenimiento.equipomedico.app.service;

import com.mantenimiento.equipomedico.app.entidad.Contrato;
import com.mantenimiento.equipomedico.app.entidad.Equipo;
import com.mantenimiento.equipomedico.app.repository.ContratoRepository;
import com.mantenimiento.equipomedico.app.repository.EquipoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Service
public class ContratoServiceImpl implements ContratoService {

    @Autowired
    private ContratoRepository contratoRepository;
    @Autowired
    private EquipoRepository equipoRepository;

    /**
     * Creación de un nuevo contrato.
     *
     * @param contrato
     * @return
     */
    @Override
    public Contrato create(Contrato contrato) {
        if(contrato.getId() != null){
            Optional<Contrato> contrato1 = contratoRepository.findById(contrato.getId());
            if(contrato1.isPresent()){
                contrato1.get().getEquipos().forEach(e -> {
                    e.getContratos().removeIf(cont -> cont.equals(contrato1.get().getId()));
                    equipoRepository.save(e);
                });
            }
        }
        Date current = Date.from((LocalDate.now().minusDays(1)).atStartOfDay().atZone(ZoneId.systemDefault()).toInstant());

        if(Objects.nonNull(contrato.getFechaFin()) &&
            current.after(contrato.getFechaFin())){
            contrato.setEstadoContrato("Finalizado");
        }
        Contrato cont = contratoRepository.save(contrato);
        contrato.getEquipos().forEach(equipo -> {
            Equipo eq = equipoRepository.findById(equipo.getId()).get();
            eq.getContratos().add(cont);
            equipoRepository.save(eq);
        });
        return contrato;
    }

    /**
     * Obtiene el contrato mediante su id.
     *
     * @param id
     * @return
     */
    @Override
    public Contrato get(Long id) {
        Optional<Contrato> entity = contratoRepository.findById(id);
        return entity.orElse(null);
    }

    /**
     * Obtiene todos los contratos.
     *
     * @return
     */
    @Override
    public List<Contrato> getAll() {
        return (ArrayList<Contrato>)contratoRepository.findAll();
    }

    @Override
    public Contrato getContratoByNumeroContrato(String numeroContrato)
    {
        return contratoRepository.getContratoByNumeroContrato(numeroContrato);
    }

    @Override
    public List<Contrato> getContratosByFilter(
        Map<String, String> customQuery)
    {
        String id = null;
        String estadoContrato = null;
        if(customQuery.containsKey("id")) {
            id = customQuery.get("id");
        }
        if(customQuery.containsKey("estadoContrato")) {
            estadoContrato = customQuery.get("estadoContrato");
        }
        return contratoRepository.getContratoByFilter(id,estadoContrato);
    }
}
