import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cohete, CohetePeticion } from './cohete.model';

@Injectable({ providedIn: 'root' })
export class CohetesService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/cohetes';

  listar(): Observable<Cohete[]> {
    return this.http.get<Cohete[]>(this.base);
  }

  obtener(id: string): Observable<Cohete> {
    return this.http.get<Cohete>(`${this.base}/${id}`);
  }

  crear(peticion: CohetePeticion): Observable<Cohete> {
    return this.http.post<Cohete>(this.base, peticion);
  }

  actualizar(id: string, peticion: CohetePeticion): Observable<Cohete> {
    return this.http.put<Cohete>(`${this.base}/${id}`, peticion);
  }

  darDeBaja(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
