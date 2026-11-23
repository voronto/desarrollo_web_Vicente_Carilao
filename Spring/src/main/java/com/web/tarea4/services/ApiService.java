package com.web.tarea4.services;

import org.springframework.stereotype.Service;

import com.web.tarea4.models.AveDTO;
import com.web.tarea4.models.Avistamiento;
import com.web.tarea4.models.AvistamientoRepository;
import com.web.tarea4.models.Nota;
import com.web.tarea4.models.NotaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;


@Service 
public class ApiService {

    private static final DateTimeFormatter FECHA = 
        DateTimeFormatter.ofPattern("dd-MM-yyyy");
    private final NotaRepository notaRepository;
    private final AvistamientoRepository avistamientoRepository;

    public ApiService(NotaRepository notaRepository,
         AvistamientoRepository avistamientoRepository) {
        this.notaRepository = notaRepository;
        this.avistamientoRepository = avistamientoRepository;
    }

    @Transactional(readOnly = true)
    public List<AveDTO> buscarPorPatron(String patron) {
        List<Avistamiento> avistamientos = avistamientoRepository.buscarPorPatron(patron);

        return avistamientos.stream().map(a -> {
            Double promedio = notaRepository.obtenerPromedioPorAvistamiento(a.getId());
            Double promedioRedondeado = (promedio != null)
                    ? Math.round(promedio * 10.0) / 10.0
                    : null;

            return new AveDTO(
                a.getId(),
                    a.getVoluntario().getNombre(),
                    a.getFechaHora().format(FECHA),
                    a.getAve().getNombre(),
                    a.getLugar(),
                    promedioRedondeado
            );
        }).toList();
    }

    @Transactional(readOnly = true)
    public boolean existeAvistamiento(Integer id) {
        return avistamientoRepository.existsById(id);
    }

    @Transactional
    public Double Validacion(Integer avistamientoId, int valorNota) {
        if (valorNota < 1 || valorNota > 7) {
            throw new IllegalArgumentException("La nota debe ser un numero entre 1 y 7.");
        }

        Avistamiento avistamiento = avistamientoRepository.findById(avistamientoId)
                .orElseThrow(() -> new IllegalArgumentException("Avistamiento no encontrado: " + avistamientoId));

        Nota nuevaNota = new Nota(avistamiento, valorNota);
        notaRepository.save(nuevaNota);

        Double nuevoPromedio = notaRepository.obtenerPromedioPorAvistamiento(avistamientoId);
        return (nuevoPromedio != null) ? Math.round(nuevoPromedio * 10.0) / 10.0 : null;
    }
}
