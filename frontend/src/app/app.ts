import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // 👈 AGREGAR
import { Productos } from './components/productos/productos';
import { Login } from './components/login/login';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, Productos, Login], // 👈 AGREGAR AQUÍ
  template: `
    <app-login *ngIf="!logueado" (loginExitoso)="iniciarSesion()"></app-login>
    <app-productos *ngIf="logueado"></app-productos>
  `
})
export class App {
  logueado = false;

  iniciarSesion() {
    this.logueado = true;
  }
}