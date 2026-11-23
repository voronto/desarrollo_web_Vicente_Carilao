package com.web.tarea4.models;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NotaRepository extends JpaRepository<Nota, Integer> {

    // Devuelve null si el avistamiento todavía no tiene notas
    @Query("SELECT AVG(n.nota) FROM Nota n WHERE n.avistamiento.id = :avistamientoId")
    Double obtenerPromedioPorAvistamiento(@Param("avistamientoId") Integer avistamientoId);
}