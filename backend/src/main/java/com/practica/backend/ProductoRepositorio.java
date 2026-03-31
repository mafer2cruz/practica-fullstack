package com.practica.backend;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// Interfaz 
public interface ProductoRepositorio extends JpaRepository<Producto, Integer> {

    // Se usa Optional para evitar errores si el producto no existe.
    Optional<Producto> findByNombre(String nombre);
}