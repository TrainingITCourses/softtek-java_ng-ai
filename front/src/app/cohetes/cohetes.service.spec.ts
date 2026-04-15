import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Cohete, CohetePeticion } from './cohete.model';
import { CohetesService } from './cohetes.service';

const coheteEjemplo: Cohete = { id: 'uuid-1', nombre: 'Atlas', capacidad: 5, rango: 'Tierra' };
const peticionEjemplo: CohetePeticion = { nombre: 'Atlas', capacidad: 5, rango: 'Tierra' };

describe('CohetesService', () => {
  let servicio: CohetesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    servicio = TestBed.inject(CohetesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('listar llama GET /api/cohetes', () => {
    servicio.listar().subscribe((lista) => {
      expect(lista).toEqual([coheteEjemplo]);
    });

    const req = httpMock.expectOne('/api/cohetes');
    expect(req.request.method).toBe('GET');
    req.flush([coheteEjemplo]);
  });

  it('obtener llama GET /api/cohetes/:id', () => {
    servicio.obtener('uuid-1').subscribe((cohete) => {
      expect(cohete).toEqual(coheteEjemplo);
    });

    const req = httpMock.expectOne('/api/cohetes/uuid-1');
    expect(req.request.method).toBe('GET');
    req.flush(coheteEjemplo);
  });

  it('crear llama POST /api/cohetes con la peticion', () => {
    servicio.crear(peticionEjemplo).subscribe((cohete) => {
      expect(cohete).toEqual(coheteEjemplo);
    });

    const req = httpMock.expectOne('/api/cohetes');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(peticionEjemplo);
    req.flush(coheteEjemplo);
  });

  it('actualizar llama PUT /api/cohetes/:id con la peticion', () => {
    servicio.actualizar('uuid-1', peticionEjemplo).subscribe((cohete) => {
      expect(cohete).toEqual(coheteEjemplo);
    });

    const req = httpMock.expectOne('/api/cohetes/uuid-1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(peticionEjemplo);
    req.flush(coheteEjemplo);
  });

  it('darDeBaja llama DELETE /api/cohetes/:id', () => {
    servicio.darDeBaja('uuid-1').subscribe();

    const req = httpMock.expectOne('/api/cohetes/uuid-1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
