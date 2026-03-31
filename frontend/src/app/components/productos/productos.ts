import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {
  // Arreglo principal y banderas de estado
  productos: any[] = [];
  cargando: boolean = false;
  editando: boolean = false;

  // Control de paginación y buscador
  filtroNombre: string = '';
  paginaActual: number = 1;
  itemsPorPagina: number = 5;

  // Modelo del formulario (inicializado por defecto)
  nuevo: any = { id: null, nombre: '', marca: '', categoria: '', precio: null, existencias: null, activo: true };

  constructor(private service: ProductoService, private cd: ChangeDetectorRef) {}

  ngOnInit() { 
    this.listar(); 
  }

  // Filtra por nombre y secciona los datos para la tabla
  get productosMostrados() {
    const filtrados = this.productos.filter(p => p.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase()));
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    return filtrados.slice(inicio, inicio + this.itemsPorPagina);
  }

  // Calcula el total de páginas según los resultados filtrados
  get totalPaginas() {
    const filtrados = this.productos.filter(p => p.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase()));
    return Math.ceil(filtrados.length / this.itemsPorPagina) || 1;
  }

  // Carga los productos desde el backend
  listar() {
    this.cargando = true;
    this.service.listar().subscribe({
      next: (data) => {
        this.productos = [...(data as any[])];
        this.cargando = false;
        this.cd.detectChanges(); // Forzamos refresco de UI
      },
      error: () => { 
        this.cargando = false; 
      }
    });
  }

  // Maneja tanto el guardado nuevo como la actualización
  guardar() {
    if (!this.nuevo.nombre || !this.nuevo.categoria) {
      Swal.fire('Atención', 'Nombre y Categoría son obligatorios', 'warning');
      return;
    }

    this.cargando = true;

    // Switch entre POST (crear) y PUT (actualizar)
    const obs = this.editando 
      ? this.service.actualizar(this.nuevo.id, this.nuevo) 
      : this.service.crear(this.nuevo);

    obs.subscribe({
      next: (productoServidor: any) => {
        
        // Actualizamos la lista local sin esperar la recarga total
        if (this.editando) {
          const index = this.productos.findIndex(p => p.id === productoServidor.id);
          if (index !== -1) {
            this.productos[index] = { ...productoServidor };
          }
        } else {
          this.productos = [productoServidor, ...this.productos];
        }

        this.productos = [...this.productos];

        // Limpieza de estados y formulario
        this.editando = false;
        this.cargando = false;
        this.nuevo = { id: null, nombre: '', marca: '', categoria: '', precio: null, existencias: null, activo: true };

        Swal.fire({
          title: '¡Guardado!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });

        this.listar(); // Sincronizamos con DB
        this.cd.detectChanges();
      },
      error: (err) => {
        this.cargando = false;
        Swal.fire('Error', err.error?.message || "Fallo en el servidor", 'error');
      }
    });
  }

  // Pasa los datos de la fila al formulario y sube el scroll
  prepararEdicion(p: any) {
    this.nuevo = { ...p };
    this.editando = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Resetea el formulario al estado inicial
  cancelarEdicion() {
    this.nuevo = { id: null, nombre: '', marca: '', categoria: '', precio: null, existencias: null, activo: true };
    this.editando = false;
    this.cargando = false;
  }

  cambiarPagina(n: number) { 
    this.paginaActual += n; 
  }

  // Confirmación con SweetAlert antes de borrar de la DB
  eliminar(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.eliminar(id).subscribe({
          next: () => {
            this.listar();
            Swal.fire('¡Eliminado!', 'El producto ha sido borrado.', 'success');
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar.', 'error');
          }
        });
      }
    });
  }

  // Cambia el estado 'activo' rápidamente desde la tabla
  toggleActivo(p: any) {
    const original = p.activo;
    p.activo = !p.activo;
    this.service.actualizar(p.id, p).subscribe({ 
      error: () => p.activo = original // Revertimos si falla
    });
  }
}