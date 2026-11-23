package com.web.tarea4.models;

import java.time.LocalDateTime;

import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;


@Entity
@Table(name = "nota")
public class Nota {

    @Id
    @GeneratedValue(
        strategy = GenerationType.IDENTITY
    )
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "avistamiento_id", nullable = false)
    private Avistamiento avistamiento;

    @Column(name = "nota", nullable = false)
    private Integer nota;

    public Nota() {}

    public Nota(Avistamiento avistamiento, Integer nota) {
        this.avistamiento = avistamiento;
        this.nota = nota;
    }

    public Integer getId() { return id; }
    public Avistamiento getAvistamiento() { return avistamiento; }
    public Integer getNota() { return nota; }
    public void setAvistamiento(Avistamiento avistamiento) { this.avistamiento = avistamiento; }
    public void setNota(Integer nota) { this.nota = nota; }


}