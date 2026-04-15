import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface SaludoRespuesta {
  aplicacion: string;
  estado: string;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class SaludoService {
  private readonly http = inject(HttpClient);

  obtenerSaludo(): Observable<SaludoRespuesta> {
    return this.http.get<SaludoRespuesta>('/api/saludo');
  }
}
