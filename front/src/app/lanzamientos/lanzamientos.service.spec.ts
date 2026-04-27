import { HttpErrorResponse } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  CambioEstadoLanzamientoPeticion,
  Lanzamiento,
  LanzamientoPeticion,
} from './lanzamiento.model';
import { extraerMensajeErrorApi } from './lanzamientos.error-adapter';
import { LanzamientosService } from './lanzamientos.service';

const lanzamientoEjemplo: Lanzamiento = {
  id: 'id-1',
  coheteId: 'cohete-1',
  fecha: '2026-06-15T18:30:00Z',
  precio: 1499.99,
  estado: 'Programado',
  motivo: null,
  activo: true,
};

const peticionEjemplo: LanzamientoPeticion = {
  coheteId: 'cohete-1',
  fecha: '2026-06-15T18:30:00Z',
  precio: 1499.99,
};

const peticionEstadoEjemplo: CambioEstadoLanzamientoPeticion = {
  estado: 'Confirmado',
};

describe('LanzamientosService', () => {
  let servicio: LanzamientosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    servicio = TestBed.inject(LanzamientosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('listar llama GET /api/lanzamientos', () => {
    servicio.listar().subscribe((lista) => {
      expect(lista).toEqual([lanzamientoEjemplo]);
    });

    const req = httpMock.expectOne('/api/lanzamientos');
    expect(req.request.method).toBe('GET');
    req.flush([lanzamientoEjemplo]);
  });

  it('obtener llama GET /api/lanzamientos/:id', () => {
    servicio.obtener('id-1').subscribe((lanzamiento) => {
      expect(lanzamiento).toEqual(lanzamientoEjemplo);
    });

    const req = httpMock.expectOne('/api/lanzamientos/id-1');
    expect(req.request.method).toBe('GET');
    req.flush(lanzamientoEjemplo);
  });

  it('crear llama POST /api/lanzamientos', () => {
    servicio.crear(peticionEjemplo).subscribe((lanzamiento) => {
      expect(lanzamiento).toEqual(lanzamientoEjemplo);
    });

    const req = httpMock.expectOne('/api/lanzamientos');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(peticionEjemplo);
    req.flush(lanzamientoEjemplo);
  });

  it('actualizar llama PUT /api/lanzamientos/:id', () => {
    servicio.actualizar('id-1', peticionEjemplo).subscribe((lanzamiento) => {
      expect(lanzamiento).toEqual(lanzamientoEjemplo);
    });

    const req = httpMock.expectOne('/api/lanzamientos/id-1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(peticionEjemplo);
    req.flush(lanzamientoEjemplo);
  });

  it('cambiarEstado llama POST /api/lanzamientos/:id/state', () => {
    servicio.cambiarEstado('id-1', peticionEstadoEjemplo).subscribe((lanzamiento) => {
      expect(lanzamiento).toEqual({ ...lanzamientoEjemplo, estado: 'Confirmado' });
    });

    const req = httpMock.expectOne('/api/lanzamientos/id-1/state');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(peticionEstadoEjemplo);
    req.flush({ ...lanzamientoEjemplo, estado: 'Confirmado' });
  });

  it('extrae mensaje estructurado de error API', () => {
    let errorRecibido: unknown;

    servicio.listar().subscribe({
      error: (error) => {
        errorRecibido = error;
      },
    });

    const req = httpMock.expectOne('/api/lanzamientos');
    req.flush(
      { code: '400', error: 'validation_failed', message: 'Peticion invalida' },
      { status: 400, statusText: 'Bad Request' },
    );

    expect(errorRecibido).toBeInstanceOf(HttpErrorResponse);
    expect(extraerMensajeErrorApi(errorRecibido, 'Error generico')).toBe('Peticion invalida');
  });
});
