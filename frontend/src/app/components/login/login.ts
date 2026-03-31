import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  // Evento para avisar al componente padre que el login fue correcto
  @Output() loginExitoso = new EventEmitter<void>();

  // Variables ligadas al formulario (ngModel)
  usuario = '';
  password = '';
  error = false;
  mensajeError = ''; // Texto que se muestra en el alert de error

  login() {
    // Validación de seguridad: no dejar campos vacíos
    if (!this.usuario || !this.password) {
      this.error = true;
      this.mensajeError = 'Por favor, completa todos los campos.';
      return;
    }

    // Lógica de acceso 
    if (this.usuario === 'admin' && this.password === '1234') {
      this.error = false;
      this.loginExitoso.emit(); // Disparamos el evento hacia afuera
    } else {
      // Si los datos no coinciden, mostramos el error y reseteamos el pass
      this.error = true;
      this.mensajeError = 'Usuario o contraseña incorrectos. Inténtalo de nuevo.';
      this.password = ''; 
    }
  }
}