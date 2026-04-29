import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReservaFormComponent } from './reserva-form.component';

describe('ReservaFormComponent', () => {
  let fixture: ComponentFixture<ReservaFormComponent>;
  let component: ReservaFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservaFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('bloquea envio cuando el formulario es invalido', () => {
    const emitidos: unknown[] = [];
    component.guardado.subscribe((payload) => emitidos.push(payload));

    component['formulario'].setValue({ nombre: '', email: 'correo-invalido', telefono: 'abc' });
    component['enviar']();

    expect(emitidos).toEqual([]);
    expect(component['formulario'].touched).toBe(true);
  });

  it('valida telefono con formato basico', () => {
    component['formulario'].setValue({
      nombre: 'Ada',
      email: 'ada@example.com',
      telefono: '+123',
    });

    expect(component['formulario'].controls.telefono.invalid).toBe(true);
  });

  it('emite payload valido cuando los datos son correctos', () => {
    const emitidos: unknown[] = [];
    component.guardado.subscribe((payload) => emitidos.push(payload));

    component['formulario'].setValue({
      nombre: 'Ada',
      email: 'ada@example.com',
      telefono: '+34123456789',
    });

    component['enviar']();

    expect(emitidos).toEqual([
      {
        nombre: 'Ada',
        email: 'ada@example.com',
        telefono: '+34123456789',
      },
    ]);
  });
});
