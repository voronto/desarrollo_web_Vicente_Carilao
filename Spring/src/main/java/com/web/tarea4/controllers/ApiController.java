package com.web.tarea4.controllers;

import java.util.List;
import java.util.Map;

import com.web.tarea4.models.AveDTO;
import com.web.tarea4.services.ApiService;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
public class ApiController{
    private final ApiService apiService;
    public ApiController(ApiService apiService) {
        this.apiService = apiService;
    }

    @GetMapping(value = "/busqueda", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<Resource> mostrarBusqueda() {
        Resource html = new ClassPathResource("templates/busqueda.html");
        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_HTML)
                .body(html);
    }

    @GetMapping("/api/avistamientos/buscar")
    public ResponseEntity<List<AveDTO>> buscar(
            @RequestParam(name = "q", defaultValue = "") String query) {

        String termino = query.trim();
        if (termino.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        List<AveDTO> resultados = apiService.buscarPorPatron(termino);
        return ResponseEntity.ok(resultados);
    }

    @PostMapping("/api/avistamientos/{id}/evaluar")
    public ResponseEntity<?> evaluar(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> body) {

        Object valorNota = body.get("nota");

        if (!(valorNota instanceof Integer)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "La nota debe ser un número entero."));
        }

        int nota = (Integer) valorNota;
        if (nota < 1 || nota > 7) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "La nota debe estar entre 1 y 7."));
        }

        if (!apiService.existeAvistamiento(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "No existe el avistamiento indicado."));
        }

        Double nuevoPromedio = apiService.Validacion(id, nota);
        return ResponseEntity.ok(Map.of(
                "avistamientoId", id,
                "nuevoPromedio", nuevoPromedio
        ));
    }
}

