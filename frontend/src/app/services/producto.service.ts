import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private api = 'http://localhost:8081/productos';

  constructor(private http: HttpClient) {}

  crear(producto: any) {
  return this.http.post(this.api, producto);
}

  listar() {
    return this.http.get(this.api);
  }

  eliminar(id: number) {
  return this.http.delete(`${this.api}/${id}`);
}

actualizar(id: number, producto: any) {
  return this.http.put(`${this.api}/${id}`, producto);
}

}