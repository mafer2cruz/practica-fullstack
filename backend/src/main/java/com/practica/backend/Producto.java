package com.practica.backend;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "productos") // Define el nombre de la tabla en la base de datos
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID autoincremental
    private Integer id;

    // El nombre no puede estar vacío y debe ser único en la tabla
    @NotBlank(message = "El nombre es obligatorio")
    @Column(nullable = false, unique = true)
    private String nombre;

    private String marca;
    private String categoria;

    // Validaciones para asegurar que el precio sea un valor lógico
    @NotNull(message = "El precio no puede ser nulo")
    @Min(value = 0, message = "El precio debe ser mayor a 0")
    @Column(nullable = false)
    private Double precio;

    // Control de stock para evitar valores negativos a nivel de base de datos
    @NotNull(message = "Las existencias no pueden ser nulas")
    @Min(value = 0, message = "Las existencias no pueden ser negativas")
    @Column(nullable = false)
    private Integer existencias;

    @Column(nullable = false)
    private Boolean activo = true; // Por defecto, el producto entra como activo

    // Constructor vacío requerido por la especificación JPA
    public Producto() {
    }

    // Constructor para inicialización rápida de objetos
    public Producto(String nombre, Double precio, Integer existencias) {
        this.nombre = nombre;
        this.precio = precio;
        this.existencias = existencias;
        this.activo = true;
    }

    // --- Métodos de acceso (Getters y Setters) ---

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }

    public Integer getExistencias() { return existencias; }
    public void setExistencias(Integer existencias) { this.existencias = existencias; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
}