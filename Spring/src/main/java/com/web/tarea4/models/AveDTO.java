package com.web.tarea4.models;

public record AveDTO(
    Integer id,
    String nombreVoluntario,
    String fechaAvistamiento,
    String nombreAve,
    String lugar,
    Double promedio
) {}