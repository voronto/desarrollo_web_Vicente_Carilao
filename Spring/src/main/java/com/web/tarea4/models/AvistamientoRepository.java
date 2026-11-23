package com.web.tarea4.models;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvistamientoRepository extends JpaRepository<Avistamiento, Integer> {

    @Query("""
        SELECT a FROM Avistamiento a
        JOIN FETCH a.ave av
        JOIN FETCH a.voluntario v
        WHERE LOWER(av.nombre) LIKE LOWER(CONCAT('%', :patron, '%'))
           OR LOWER(v.nombre) LIKE LOWER(CONCAT('%', :patron, '%'))
           OR LOWER(a.lugar) LIKE LOWER(CONCAT('%', :patron, '%'))
        ORDER BY a.fechaHora DESC
    """)
    List<Avistamiento> buscarPorPatron(@Param("patron") String patron);
}