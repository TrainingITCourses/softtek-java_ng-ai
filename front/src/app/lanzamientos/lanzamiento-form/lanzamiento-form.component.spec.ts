import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { CohetesService } from '../../cohetes/cohetes.service';
import { Lanzamiento } from '../lanzamiento.model';
import { LanzamientoFormComponent } from './lanzamiento-form.component';

describe('LanzamientoFormComponent', () => {
  let fixture: ComponentFixture<LanzamientoFormComponent>;
  let component: LanzamientoFormComponent;
  let cohetesServiceMock: { listar: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    cohetesServiceMock = {
      listar: vi.fn(() =>
        of([
          { id: 'cohete-1', nombre: 'Atlas', capacidad: 5, rango: 'Tierra' },
          { id: 'cohete-2', nombre: 'Nova', capacidad: 4, rango: 'Luna' },
        ]),
      ),
    };

    await TestBed.configureTestingModule({
      imports: [LanzamientoFormComponent],
      providers: [{ provide: CohetesService, useValue: cohetesServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(LanzamientoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('el formulario es invalido cuando esta vacio', () => {
    component['formulario'].setValue({ coheteId: '', fecha: '', precio: 0 });
    expect(component['formulario'].invalid).toBe(true);
  });

  it('valida formato de fecha ISO', () => {
    component['formulario'].setValue({
      coheteId: 'cohete-1',
      fecha: '2026-06-15 18:30:00',
      precio: 100,
    });

    expect(component['formulario'].controls.fecha.invalid).toBe(true);
  });

  it('emite guardado con payload valido', () => {
    const emitidos: unknown[] = [];
    component.guardado.subscribe((payload) => emitidos.push(payload));

    component['formulario'].setValue({
      coheteId: 'cohete-1',
      fecha: '2026-06-15T18:30:00Z',
      precio: 2000,
    });

    component['enviar']();

    expect(emitidos).toEqual([
      {
        coheteId: 'cohete-1',
        fecha: '2026-06-15T18:30:00Z',
        precio: 2000,
      },
    ]);
  });

  it('precarga datos en modo edicion', async () => {
    const lanzamiento: Lanzamiento = {
      id: 'id-1',
      coheteId: 'cohete-2',
      fecha: '2026-08-01T11:00:00Z',
      precio: 999,
      estado: 'Confirmado',
      motivo: null,
      activo: true,
    };

    fixture = TestBed.createComponent(LanzamientoFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('lanzamientoEditar', lanzamiento);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component['formulario'].value).toEqual({
      coheteId: 'cohete-2',
      fecha: '2026-08-01T11:00:00Z',
      precio: 999,
    });
  });

  it('muestra error de servidor accionable', () => {
    component.setErrorServidor(
      new HttpErrorResponse({
        status: 400,
        statusText: 'Bad Request',
        error: { code: '400', error: 'validation_failed', message: 'Precio invalido' },
      }),
    );

    fixture.detectChanges();
    const nodo = fixture.nativeElement as HTMLElement;
    expect(nodo.querySelector('p[role="alert"]')?.textContent).toContain('Precio invalido');
  });

  it('muestra error cuando falla la carga de cohetes', () => {
    cohetesServiceMock.listar.mockReturnValueOnce(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 500,
            statusText: 'Server Error',
            error: { code: '500', error: 'server_error', message: 'Sin cohetes' },
          }),
      ),
    );

    fixture = TestBed.createComponent(LanzamientoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const nodo = fixture.nativeElement as HTMLElement;
    expect(nodo.querySelector('p[role="alert"]')?.textContent).toContain('Sin cohetes');
  });
});
