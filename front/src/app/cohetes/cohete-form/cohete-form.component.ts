import {
    ChangeDetectionStrategy,
    Component,
    inject,
    input,
    OnInit,
    output,
    signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cohete, CohetePeticion, Rango, RANGOS } from '../cohete.model';

@Component({
  selector: 'app-cohete-form',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="formulario" (ngSubmit)="enviar()">
      <h2>{{ coheteEditar() ? 'Editar cohete' : 'Nuevo cohete' }}</h2>

      <div>
        <label for="nombre">Nombre</label>
        <input id="nombre" formControlName="nombre" type="text" aria-required="true" />
        @if (formulario.controls.nombre.invalid && formulario.controls.nombre.touched) {
          <span role="alert" class="inline-alert">El nombre debe tener entre 3 y 10 caracteres</span>
        }
      </div>

      <div>
        <label for="capacidad">Capacidad</label>
        <input id="capacidad" formControlName="capacidad" type="number" min="1" max="9" aria-required="true" />
        @if (formulario.controls.capacidad.invalid && formulario.controls.capacidad.touched) {
          <span role="alert" class="inline-alert">La capacidad debe estar entre 1 y 9</span>
        }
      </div>

      <div>
        <label for="rango">Rango</label>
        <select id="rango" formControlName="rango" aria-required="true">
          <option value="">-- Selecciona --</option>
          @for (r of rangos; track r) {
            <option [value]="r">{{ r }}</option>
          }
        </select>
        @if (formulario.controls.rango.invalid && formulario.controls.rango.touched) {
          <span role="alert" class="inline-alert">El rango es obligatorio</span>
        }
      </div>

      @if (errorServidor()) {
        <p role="alert" class="error">{{ errorServidor() }}</p>
      }

      <div class="actions-row">
        <button type="submit" [disabled]="formulario.invalid">
          {{ coheteEditar() ? 'Guardar' : 'Crear' }}
        </button>
        <button type="button" (click)="cancelado.emit()">Cancelar</button>
      </div>
    </form>
  `,
})
export class CoheteFormComponent implements OnInit {
  readonly coheteEditar = input<Cohete | null>(null);
  readonly guardado = output<CohetePeticion>();
  readonly cancelado = output<void>();

  protected readonly rangos = RANGOS;
  protected readonly errorServidor = signal<string | null>(null);

  private readonly fb = inject(FormBuilder);

  protected readonly formulario = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
    capacidad: [1, [Validators.required, Validators.min(1), Validators.max(9)]],
    rango: ['', Validators.required],
  });

  ngOnInit(): void {
    const cohete = this.coheteEditar();
    if (cohete) {
      this.formulario.setValue({
        nombre: cohete.nombre,
        capacidad: cohete.capacidad,
        rango: cohete.rango,
      });
    }
  }

  setErrorServidor(mensaje: string): void {
    this.errorServidor.set(mensaje);
  }

  protected enviar(): void {
    if (this.formulario.invalid) return;
    const { nombre, capacidad, rango } = this.formulario.getRawValue();
    this.guardado.emit({ nombre: nombre!, capacidad: capacidad!, rango: rango as Rango });
  }
}
