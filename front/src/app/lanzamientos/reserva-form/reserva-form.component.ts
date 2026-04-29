import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReservaPeticion } from '../lanzamiento.model';

@Component({
  selector: 'app-reserva-form',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="formulario" (ngSubmit)="enviar()" aria-label="Crear reserva">
      <h3>Nueva reserva</h3>

      <div>
        <label for="nombre">Nombre</label>
        <input id="nombre" type="text" formControlName="nombre" aria-required="true" />
        @if (formulario.controls.nombre.invalid && formulario.controls.nombre.touched) {
          <span role="alert">El nombre es obligatorio</span>
        }
      </div>

      <div>
        <label for="email">Email</label>
        <input id="email" type="email" formControlName="email" aria-required="true" />
        @if (formulario.controls.email.invalid && formulario.controls.email.touched) {
          <span role="alert">El email no es válido</span>
        }
      </div>

      <div>
        <label for="telefono">Teléfono</label>
        <input id="telefono" type="tel" formControlName="telefono" aria-required="true" />
        @if (formulario.controls.telefono.invalid && formulario.controls.telefono.touched) {
          <span role="alert">El teléfono debe tener entre 7 y 15 dígitos, con prefijo + opcional</span>
        }
      </div>

      <button type="submit" [disabled]="formulario.invalid">Crear reserva</button>
      <button type="button" (click)="cancelado.emit()">Cancelar</button>
    </form>
  `,
})
export class ReservaFormComponent {
  readonly guardado = output<ReservaPeticion>();
  readonly cancelado = output<void>();

  private readonly fb = inject(FormBuilder);

  protected readonly formulario = this.fb.group({
    nombre: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.pattern(/^\+?\d{7,15}$/)]],
  });

  protected enviar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const { nombre, email, telefono } = this.formulario.getRawValue();
    this.guardado.emit({
      nombre: nombre!.trim(),
      email: email!.trim(),
      telefono: telefono!.trim(),
    });
  }
}
