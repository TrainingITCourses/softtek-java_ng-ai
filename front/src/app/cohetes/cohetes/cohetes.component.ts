import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
    signal,
    viewChild,
} from '@angular/core';
import { CoheteFormComponent } from '../cohete-form/cohete-form.component';
import { Cohete, CohetePeticion } from '../cohete.model';
import { CohetesService } from '../cohetes.service';

@Component({
  selector: 'app-cohetes',
  imports: [CoheteFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main>
      <h1>Cohetes</h1>

      @if (aviso(); as a) {
        <p role="status" [class]="a.esError ? 'error' : 'exito'">{{ a.texto }}</p>
      }

      @if (mostrarFormulario()) {
        <app-cohete-form
          #formRef
          [coheteEditar]="coheteSeleccionado()"
          (guardado)="onGuardar($event)"
          (cancelado)="cerrarFormulario()"
        />
      } @else {
        <button type="button" (click)="abrirFormularioCrear()">Añadir cohete</button>
      }

      <table aria-label="Listado de cohetes">
        <caption>Flota activa</caption>
        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Capacidad</th>
            <th scope="col">Rango</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (cohete of cohetes(); track cohete.id) {
            <tr>
              <td>{{ cohete.nombre }}</td>
              <td>{{ cohete.capacidad }}</td>
              <td>{{ cohete.rango }}</td>
              <td>
                <button type="button" (click)="abrirFormularioEditar(cohete)">Editar</button>
                <button type="button" (click)="darDeBaja(cohete.id)">Dar de baja</button>
              </td>
            </tr>
          } @empty {
            <tr><td colspan="4">No hay cohetes registrados</td></tr>
          }
        </tbody>
      </table>
    </main>
  `,
})
type Aviso = { texto: string; esError: boolean };

export class CohetesComponent implements OnInit {
  private readonly formRef = viewChild<CoheteFormComponent>('formRef');

  private readonly servicio = inject(CohetesService);

  protected readonly cohetes = signal<Cohete[]>([]);
  protected readonly mostrarFormulario = signal(false);
  protected readonly coheteSeleccionado = signal<Cohete | null>(null);
  protected readonly aviso = signal<Aviso | null>(null);

  ngOnInit(): void {
    this.cargarCohetes();
  }

  private cargarCohetes(): void {
    this.servicio.listar().subscribe({
      next: (lista) => this.cohetes.set(lista),
      error: () => this.mostrarMensaje('Error al cargar los cohetes', true),
    });
  }

  protected abrirFormularioCrear(): void {
    this.coheteSeleccionado.set(null);
    this.mostrarFormulario.set(true);
    this.limpiarMensaje();
  }

  protected abrirFormularioEditar(cohete: Cohete): void {
    this.coheteSeleccionado.set(cohete);
    this.mostrarFormulario.set(true);
    this.limpiarMensaje();
  }

  protected cerrarFormulario(): void {
    this.mostrarFormulario.set(false);
    this.coheteSeleccionado.set(null);
  }

  protected onGuardar(peticion: CohetePeticion): void {
    const seleccionado = this.coheteSeleccionado();
    const operacion = seleccionado
      ? this.servicio.actualizar(seleccionado.id, peticion)
      : this.servicio.crear(peticion);

    operacion.subscribe({
      next: () => {
        this.cerrarFormulario();
        this.cargarCohetes();
        this.mostrarMensaje(seleccionado ? 'Cohete actualizado' : 'Cohete creado', false);
      },
      error: (err) => {
        const mensajeError = err?.error?.message ?? 'Error al guardar el cohete';
        this.formRef()?.setErrorServidor(mensajeError);
      },
    });
  }

  protected darDeBaja(id: string): void {
    this.servicio.darDeBaja(id).subscribe({
      next: () => {
        this.cargarCohetes();
        this.mostrarMensaje('Cohete dado de baja', false);
      },
      error: () => this.mostrarMensaje('Error al dar de baja el cohete', true),
    });
  }

  private mostrarMensaje(texto: string, esError: boolean): void {
    this.aviso.set({ texto, esError });
  }

  private limpiarMensaje(): void {
    this.aviso.set(null);
  }
}
