import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    CambioEstadoLanzamientoPeticion,
    Lanzamiento,
    LanzamientoPeticion,
    Reserva,
    ReservaPeticion,
} from './lanzamiento.model';
import { obtenerRolActual } from './rol-operaciones';

@Injectable({ providedIn: 'root' })
export class LanzamientosService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/lanzamientos';

  listar(): Observable<Lanzamiento[]> {
    return this.http.get<Lanzamiento[]>(this.base);
  }

  obtener(id: string): Observable<Lanzamiento> {
    return this.http.get<Lanzamiento>(`${this.base}/${id}`);
  }

  crear(peticion: LanzamientoPeticion): Observable<Lanzamiento> {
    return this.http.post<Lanzamiento>(this.base, peticion);
  }

  actualizar(id: string, peticion: LanzamientoPeticion): Observable<Lanzamiento> {
    return this.http.put<Lanzamiento>(`${this.base}/${id}`, peticion);
  }

  cambiarEstado(id: string, peticion: CambioEstadoLanzamientoPeticion): Observable<Lanzamiento> {
    return this.http.post<Lanzamiento>(`${this.base}/${id}/state`, peticion, {
      headers: { 'X-Rol': obtenerRolActual() },
    });
  }

  crearReserva(id: string, peticion: ReservaPeticion): Observable<Reserva> {
    return this.http.post<Reserva>(`${this.base}/${id}/reservas`, peticion);
  }
}
