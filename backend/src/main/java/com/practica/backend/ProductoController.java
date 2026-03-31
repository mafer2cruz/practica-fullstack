package com.practica.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/productos")
@CrossOrigin(origins = "*") // Permite que el frontend (Angular) se conecte sin errores de CORS
public class ProductoController {

    @Autowired
    private ProductoServicio service; // Inyección de la lógica de negocio

    // Endpoint para traer toda la lista de productos
    @GetMapping
    public List<Producto> listar() {
        return service.listar();
    }

    // Recibe un JSON y lo mapea a un objeto Producto para guardarlo
    @PostMapping
    public Producto crear(@RequestBody Producto producto) {
        return service.crear(producto);
    }

    // Busca un producto específico por su ID 
    @GetMapping("/{id}")
    public Producto obtener(@PathVariable Integer id) {
        return service.obtener(id);
    }

    // Actualiza los datos de un registro existente mediante su ID
    @PutMapping("/{id}")
    public Producto actualizar(@PathVariable Integer id, @RequestBody Producto producto) {
        return service.actualizar(id, producto);
    }

    // Borra el registro de la base de datos
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        service.eliminar(id);
    }

    // Cambia el estado del producto (activo/inactivo) sin borrarlo
    @PatchMapping("/{id}/activar")
    public Producto activar(@PathVariable Integer id) {
        return service.activar(id);
    }

    // Endpoint especial para sumar o restar stock
    @PostMapping("/{id}/ajustar")
    public Producto ajustar(@PathVariable Integer id, @RequestBody Integer cantidad) {
        return service.ajustarInventario(id, cantidad);
    }
}