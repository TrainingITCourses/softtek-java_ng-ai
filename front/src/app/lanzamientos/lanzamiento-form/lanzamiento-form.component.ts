import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { Cohete } from '../../cohetes/cohete.model';
import { CohetesService } from '../../cohetes/cohetes.service';
import { extraerMensajeErrorApi } from '../lanzamientos.error-adapter';
import { Lanzamiento, LanzamientoPeticion } from '../lanzamiento.model';

function validadorFechaIso(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;
    if (typeof valor !== 'string' || !valor.trim()) {
      return { fechaInvalida: true };
    }

    const regexIso = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(\.\d{1,3})?Z$/;
    if (!regexIso.test(valor.trim())) {
      return { fechaInvalida: true };
    }

    const fecha = new Date(valor);
    return Number.isNaN(fecha.getTime()) ? { fechaInvalida: true } : null;
  };
}

@Component({
  selector: 'app-lanzamiento-form',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="formulario" (ngSubmit)="enviar()">
      <h2>{{ lanzamientoEditar() ? 'Editar lanzamiento' : 'Nuevo lanzamiento' }}</h2>

      <div>
        <label for="coheteId">Cohete</label>
        <select id="coheteId" formControlName="coheteId" aria-required="true">
          <option value="">-- Selecciona --</option>
          @for (cohete of cohetesActivos(); track cohete.id) {
            <option [value]="cohete.id">{{ cohete.nombre }}</option>
          }
        </select>
        @if (formulario.controls.coheteId.invalid && formulario.controls.coheteId.touched) {
          <span role="alert">Debes seleccionar un cohete</span>
        }
      </div>

      <div>
        <label for="fecha">Fecha (ISO)</label>
        <input
          id="fecha"
          formControlName="fecha"
          type="text"
          placeholder="2026-06-15T18:30:00Z"
          aria-required="true"
        />
        @if (formulario.controls.fecha.invalid && formulario.controls.fecha.touched) {
          <span role="alert">La fecha debe ser ISO valida (ej: 2026-06-15T18:30:00Z)</span>
        }
      </div>

      <div>
        <label for="precio">Precio</label>
        <input id="precio" formControlName="precio" type="number" min="0.01" step="0.01" aria-required="true" />
        @if (formulario.controls.precio.invalid && formulario.controls.precio.touched) {
          <span role="alert">El precio debe ser mayor que 0</span>
        }
      </div>

      @if (errorServidor()) {
        <p role="alert" class="error">{{ errorServidor() }}</p>
      }

      <button type="submit" [disabled]="formulario.invalid">
        {{ lanzamientoEditar() ? 'Guardar' : 'Crear' }}
      </button>
      <button type="button" (click)="cancelado.emit()">Cancelar</button>
    </form>
  `,
})
export class LanzamientoFormComponent implements OnInit {
  readonly lanzamientoEditar = input<Lanzamiento | null>(null);
  readonly guardado = output<LanzamientoPeticion>();
  readonly cancelado = output<void>();

  protected readonly cohetesActivos = signal<Cohete[]>([]);
  protected readonly errorServidor = signal<string | null>(null);

  private readonly cohetesService = inject(CohetesService);
  private readonly fb = inject(FormBuilder);

  protected readonly formulario = this.fb.group({
    coheteId: ['', Validators.required],
    fecha: ['', [Validators.required, validadorFechaIso()]],
    precio: [1, [Validators.required, Validators.min(0.01)]],
  });

  ngOnInit(): void {
    this.cargarCohetes();

    const lanzamiento = this.lanzamientoEditar();
    if (lanzamiento) {
      this.formulario.setValue({
        coheteId: lanzamiento.coheteId,
        fecha: lanzamiento.fecha,
        precio: lanzamiento.precio,
      });
    }
  }

  setErrorServidor(error: unknown): void {
    this.errorServidor.set(extraerMensajeErrorApi(error, 'No se pudo guardar el lanzamiento'));
  }

  protected enviar(): void {
    this.errorServidor.set(null);
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const { coheteId, fecha, precio } = this.formulario.getRawValue();
    this.guardado.emit({
      coheteId: coheteId!,
      fecha: fecha!,
      precio: Number(precio),
    });
  }

  private cargarCohetes(): void {
    this.cohetesService.listar().subscribe({
      next: (cohetes) => this.cohetesActivos.set(cohetes),
      error: (error) => this.setErrorServidor(error),
    });
  }
}
