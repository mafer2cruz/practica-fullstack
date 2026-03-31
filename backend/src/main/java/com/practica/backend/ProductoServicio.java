package com.practica.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoServicio {

    @Autowired
    private ProductoRepositorio repo;

    // Obtiene todos los registros de la tabla productos
    public List<Producto> listar() {
        return repo.findAll();
    }

    // Método para insertar nuevos productos con validaciones de seguridad
    public Producto crear(Producto p) {

        if (p.getNombre() == null || p.getNombre().isEmpty()) {
            throw new RuntimeException("Nombre obligatorio");
        }

        if (p.getPrecio() <= 0) {
            throw new RuntimeException("El precio debe ser mayor a 0");
        }

        if (p.getExistencias() < 0) {
            throw new RuntimeException("Existencias no pueden ser negativas");
        }

        // Evita que se dupliquen nombres en la base de datos
        if (repo.findByNombre(p.getNombre()).isPresent()) {
            throw new RuntimeException("El nombre ya existe");
        }

        return repo.save(p);
    }

    // Busca un solo producto o lanza error si el ID no existe
    public Producto obtener(Integer id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("No encontrado"));
    }

    // Actualiza los datos de un producto validando que el nombre no choque con otros
    public Producto actualizar(Integer id, Producto detalles) {
        // Buscamos el registro original
        Producto producto = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe el producto con ID: " + id));

        // Validación para permitir el mismo nombre si es el mismo ID que estamos editando
        repo.findByNombre(detalles.getNombre()).ifPresent(existente -> {
            if (!existente.getId().equals(id)) {
                throw new RuntimeException("El nombre ya existe en otro producto");
            }
        });

        // valores
        producto.setNombre(detalles.getNombre());
        producto.setMarca(detalles.getMarca());
        producto.setCategoria(detalles.getCategoria());
        producto.setPrecio(detalles.getPrecio());
        producto.setExistencias(detalles.getExistencias());
        producto.setActivo(detalles.getActivo());

        return repo.save(producto);
    }

    // Elimina físicamente el registro mediante el ID
    public void eliminar(Integer id) {
        repo.deleteById(id);
    }

    // Cambia el estado booleano (Activo/Inactivo)
    public Producto activar(Integer id) {
        Producto p = obtener(id);
        p.setActivo(!p.getActivo());
        return repo.save(p);
    }

    // Suma o resta stock validando que no quede en números negativos
    public Producto ajustarInventario(Integer id, Integer cantidad) {
        Producto p = obtener(id);

        if (p.getExistencias() + cantidad < 0) {
            throw new RuntimeException("No puedes dejar existencias negativas");
        }

        p.setExistencias(p.getExistencias() + cantidad);
        return repo.save(p);
    }
}