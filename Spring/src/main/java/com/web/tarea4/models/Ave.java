package com.web.tarea4.models;

import jakarta.persistence.*;

@Entity 
@Table(name = "ave")
public class Ave {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nombre", nullable = false, length = 80)
    private String nombre;

    public Ave() {}

    public Integer getId() { return id; }
    public String getNombre() { return nombre; }

}
