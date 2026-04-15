import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Cohete } from '../cohete.model';
import { CoheteFormComponent } from './cohete-form.component';

describe('CoheteFormComponent', () => {
  let fixture: ComponentFixture<CoheteFormComponent>;
  let component: CoheteFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoheteFormComponent, ReactiveFormsModule],
    }).compileComponents();
    fixture = TestBed.createComponent(CoheteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('el formulario es inválido cuando está vacío', () => {
    expect(component['formulario'].invalid).toBe(true);
  });

  it('emite guardado con los datos cuando el formulario es válido', () => {
    const emitidos: unknown[] = [];
    component.guardado.subscribe((p) => emitidos.push(p));

    component['formulario'].setValue({ nombre: 'Atlas', capacidad: 5, rango: 'Tierra' });
    component['enviar']();

    expect(emitidos).toEqual([{ nombre: 'Atlas', capacidad: 5, rango: 'Tierra' }]);
  });

  it('no emite guardado cuando el formulario es inválido', () => {
    const emitidos: unknown[] = [];
    component.guardado.subscribe((p) => emitidos.push(p));

    component['formulario'].setValue({ nombre: 'AB', capacidad: 0, rango: '' });
    component['enviar']();

    expect(emitidos).toHaveLength(0);
  });

  it('precarga datos si coheteEditar tiene valor', async () => {
    const cohete: Cohete = { id: 'uuid-1', nombre: 'Atlas', capacidad: 5, rango: 'Tierra' };
    fixture = TestBed.createComponent(CoheteFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('coheteEditar', cohete);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component['formulario'].value).toEqual({
      nombre: 'Atlas',
      capacidad: 5,
      rango: 'Tierra',
    });
  });

  it('nombre invalido con menos de 3 caracteres', () => {
    component['formulario'].controls.nombre.setValue('AB');
    expect(component['formulario'].controls.nombre.invalid).toBe(true);
  });

  it('nombre invalido con mas de 10 caracteres', () => {
    component['formulario'].controls.nombre.setValue('NombreLargo11');
    expect(component['formulario'].controls.nombre.invalid).toBe(true);
  });

  it('capacidad invalida con valor 0', () => {
    component['formulario'].controls.capacidad.setValue(0);
    expect(component['formulario'].controls.capacidad.invalid).toBe(true);
  });

  it('capacidad invalida con valor 10', () => {
    component['formulario'].controls.capacidad.setValue(10);
    expect(component['formulario'].controls.capacidad.invalid).toBe(true);
  });

  it('setErrorServidor muestra el mensaje de error', () => {
    component.setErrorServidor('Error del servidor');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[role="alert"].error, p[role="alert"]')?.textContent).toContain(
      'Error del servidor',
    );
  });
});
