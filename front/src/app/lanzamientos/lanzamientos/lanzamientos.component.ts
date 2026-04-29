import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    OnInit,
    signal,
    viewChild,
} from '@angular/core';
import { LanzamientoFormComponent } from '../lanzamiento-form/lanzamiento-form.component';
import { obtenerTransicionesPermitidas, requiereMotivo } from '../lanzamiento-transiciones';
import {
    EstadoLanzamiento,
    Lanzamiento,
    LanzamientoPeticion,
    ReservaPeticion,
} from '../lanzamiento.model';
import { extraerMensajeErrorApi } from '../lanzamientos.error-adapter';
import { LanzamientosService } from '../lanzamientos.service';
import { ReservaFormComponent } from '../reserva-form/reserva-form.component';

type EstadoCarga = 'idle' | 'loading' | 'success' | 'error';

type Aviso = {
  texto: string;
  esError: boolean;
};

type ModalCambioEstado = {
  lanzamientoId: string;
  estadoDestino: EstadoLanzamiento;
};

@Component({
  selector: 'app-lanzamientos',
  imports: [LanzamientoFormComponent, ReservaFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="module-layout" aria-label="Modulo de lanzamientos" id="reservas">
      <header class="module-header">
        <div>
          <h2>Lanzamientos</h2>
          <p class="module-note">Control de operaciones, cambios de estado y reservas.</p>
        </div>

        @if (!mostrarFormulario()) {
          <button type="button" (click)="abrirFormularioCrear()">Nuevo lanzamiento</button>
        }
      </header>

      @if (mostrarFormulario()) {
        <div class="panel-block">
          <app-lanzamiento-form
            #formRef
            [lanzamientoEditar]="lanzamientoEnEdicion()"
            (guardado)="guardarLanzamiento($event)"
            (cancelado)="cerrarFormulario()"
          />
        </div>
      }

      @if (estadoCarga() === 'loading') {
        <p>Cargando lanzamientos...</p>
      }

      @if (aviso(); as a) {
        <p [attr.role]="a.esError ? 'alert' : 'status'" [class]="a.esError ? 'error' : 'exito'">{{ a.texto }}</p>
      }

      <div class="panel-block">
        <table aria-label="Listado de lanzamientos">
          <caption>Operaciones activas</caption>
          <thead>
            <tr>
              <th scope="col">Cohete</th>
              <th scope="col">Fecha</th>
              <th scope="col">Precio</th>
              <th scope="col">Estado</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (lanzamiento of lanzamientos(); track lanzamiento.id) {
              <tr>
                <td>{{ lanzamiento.coheteId }}</td>
                <td>{{ formatearFecha(lanzamiento.fecha) }}</td>
                <td>{{ formatearPrecio(lanzamiento.precio) }}</td>
                <td>{{ lanzamiento.estado }}</td>
                <td>
                  <div class="actions-row">
                    <button type="button" (click)="seleccionarDetalle(lanzamiento)">Detalle</button>
                    <button type="button" (click)="abrirFormularioEditar(lanzamiento)">Editar</button>
                    @for (estadoDestino of transicionesPara(lanzamiento.estado); track estadoDestino) {
                      <button
                        type="button"
                        (click)="prepararCambioEstado(lanzamiento, estadoDestino)"
                      >
                        {{ estadoDestino }}
                      </button>
                    }
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="5">No hay lanzamientos registrados</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      @if (lanzamientoSeleccionado(); as detalle) {
        <section class="panel-block" aria-label="Detalle de lanzamiento">
          <h2>Detalle</h2>
          <div class="detail-grid">
            <p><strong>ID:</strong> {{ detalle.id }}</p>
            <p><strong>Cohete:</strong> {{ detalle.coheteId }}</p>
            <p><strong>Fecha:</strong> {{ formatearFecha(detalle.fecha) }}</p>
            <p><strong>Precio:</strong> {{ formatearPrecio(detalle.precio) }}</p>
            <p><strong>Estado:</strong> {{ detalle.estado }}</p>
            <p><strong>Capacidad total:</strong> {{ detalle.capacidadTotal }}</p>
            <p><strong>Plazas disponibles:</strong> {{ detalle.plazasDisponibles }}</p>
            @if (detalle.motivo) {
              <p><strong>Motivo:</strong> {{ detalle.motivo }}</p>
            } @else {
              <p><strong>Motivo:</strong> Sin motivo</p>
            }
            <p><strong>Activo:</strong> {{ detalle.activo ? 'Si' : 'No' }}</p>
          </div>

          @if (!mostrarFormularioReserva()) {
            <button
              type="button"
              (click)="abrirFormularioReserva()"
              [disabled]="!puedeReservar(detalle)"
            >
              Crear reserva
            </button>
          }

          @if (mostrarFormularioReserva()) {
            <div class="panel-block">
              <app-reserva-form
                (guardado)="guardarReserva($event)"
                (cancelado)="cerrarFormularioReserva()"
              />
            </div>
          }
        </section>
      } @else {
        <p>Selecciona un lanzamiento para ver el detalle.</p>
      }

      @if (modalCambioEstado(); as modal) {
        <section
          class="panel-block dialog-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-modal-cambio-estado"
          aria-describedby="descripcion-modal-cambio-estado"
        >
          <h2 id="titulo-modal-cambio-estado">Cambio de estado</h2>
          <p id="descripcion-modal-cambio-estado">
            El estado {{ modal.estadoDestino }} requiere motivo. Indica el motivo para continuar.
          </p>

          <label for="motivo">Motivo</label>
          <input #motivoInput id="motivo" type="text" [value]="motivoCambioEstado()" (input)="actualizarMotivo($event)" />

          @if (errorModalCambioEstado()) {
            <p role="alert" class="inline-alert">{{ errorModalCambioEstado() }}</p>
          }

          <div class="actions-row">
            <button type="button" (click)="confirmarCambioEstadoConMotivo()">Confirmar</button>
            <button type="button" (click)="cerrarModalCambioEstado()">Cancelar</button>
          </div>
        </section>
      }
    </section>
  `,
})
export class LanzamientosComponent implements OnInit {
  private readonly formRef = viewChild<LanzamientoFormComponent>('formRef');
  private readonly motivoInputRef = viewChild<ElementRef<HTMLInputElement>>('motivoInput');
  private readonly servicio = inject(LanzamientosService);

  protected readonly estadoCarga = signal<EstadoCarga>('idle');
  protected readonly lanzamientos = signal<Lanzamiento[]>([]);
  protected readonly lanzamientoSeleccionado = signal<Lanzamiento | null>(null);
  protected readonly lanzamientoEnEdicion = signal<Lanzamiento | null>(null);
  protected readonly mostrarFormulario = signal(false);
  protected readonly mostrarFormularioReserva = signal(false);
  protected readonly modalCambioEstado = signal<ModalCambioEstado | null>(null);
  protected readonly motivoCambioEstado = signal('');
  protected readonly errorModalCambioEstado = signal<string | null>(null);
  protected readonly aviso = signal<Aviso | null>(null);

  ngOnInit(): void {
    this.cargarLanzamientos();
  }

  protected seleccionarDetalle(lanzamiento: Lanzamiento): void {
    this.lanzamientoSeleccionado.set(lanzamiento);
    this.mostrarFormularioReserva.set(false);
  }

  protected abrirFormularioCrear(): void {
    this.lanzamientoEnEdicion.set(null);
    this.mostrarFormulario.set(true);
    this.aviso.set(null);
  }

  protected abrirFormularioEditar(lanzamiento: Lanzamiento): void {
    this.lanzamientoEnEdicion.set(lanzamiento);
    this.mostrarFormulario.set(true);
    this.aviso.set(null);
  }

  protected cerrarFormulario(): void {
    this.lanzamientoEnEdicion.set(null);
    this.mostrarFormulario.set(false);
  }

  protected guardarLanzamiento(peticion: LanzamientoPeticion): void {
    const enEdicion = this.lanzamientoEnEdicion();
    const operacion = enEdicion
      ? this.servicio.actualizar(enEdicion.id, peticion)
      : this.servicio.crear(peticion);

    operacion.subscribe({
      next: (lanzamientoGuardado) => {
        this.cerrarFormulario();
        this.recargarTrasOperacion(lanzamientoGuardado.id);
        this.aviso.set({
          texto: enEdicion ? 'Lanzamiento actualizado' : 'Lanzamiento creado',
          esError: false,
        });
      },
      error: (error) => {
        this.formRef()?.setErrorServidor(error);
      },
    });
  }

  protected transicionesPara(estado: EstadoLanzamiento): EstadoLanzamiento[] {
    return obtenerTransicionesPermitidas(estado);
  }

  protected prepararCambioEstado(lanzamiento: Lanzamiento, estadoDestino: EstadoLanzamiento): void {
    if (requiereMotivo(estadoDestino)) {
      this.modalCambioEstado.set({ lanzamientoId: lanzamiento.id, estadoDestino });
      this.motivoCambioEstado.set('');
      this.errorModalCambioEstado.set(null);
      queueMicrotask(() => this.motivoInputRef()?.nativeElement.focus());
      return;
    }

    const confirmado = confirm(
      `Se cambiara el estado a ${estadoDestino}. ¿Deseas continuar?`,
    );
    if (!confirmado) {
      return;
    }

    this.ejecutarCambioEstado(lanzamiento.id, estadoDestino, null);
  }

  protected actualizarMotivo(evento: Event): void {
    const elemento = evento.target as HTMLInputElement | null;
    this.motivoCambioEstado.set(elemento?.value ?? '');
  }

  protected abrirFormularioReserva(): void {
    this.mostrarFormularioReserva.set(true);
    this.aviso.set(null);
  }

  protected cerrarFormularioReserva(): void {
    this.mostrarFormularioReserva.set(false);
  }

  protected guardarReserva(peticion: ReservaPeticion): void {
    const detalle = this.lanzamientoSeleccionado();
    if (!detalle) {
      return;
    }

    this.servicio.crearReserva(detalle.id, peticion).subscribe({
      next: () => {
        this.mostrarFormularioReserva.set(false);
        this.recargarTrasOperacion(detalle.id);
        this.aviso.set({ texto: 'Reserva creada correctamente', esError: false });
      },
      error: (error) => {
        this.aviso.set({
          texto: extraerMensajeErrorApi(error, 'No se pudo crear la reserva'),
          esError: true,
        });
      },
    });
  }

  protected puedeReservar(lanzamiento: Lanzamiento): boolean {
    const estadoPermitido = lanzamiento.estado === 'Programado' || lanzamiento.estado === 'Confirmado';
    return estadoPermitido && lanzamiento.plazasDisponibles > 0;
  }

  protected confirmarCambioEstadoConMotivo(): void {
    const modal = this.modalCambioEstado();
    if (!modal) {
      return;
    }

    const motivo = this.motivoCambioEstado().trim();
    if (!motivo) {
      this.errorModalCambioEstado.set('El motivo es obligatorio para este estado.');
      this.motivoInputRef()?.nativeElement.focus();
      return;
    }

    this.ejecutarCambioEstado(modal.lanzamientoId, modal.estadoDestino, motivo);
  }

  protected cerrarModalCambioEstado(): void {
    this.modalCambioEstado.set(null);
    this.motivoCambioEstado.set('');
    this.errorModalCambioEstado.set(null);
  }

  protected formatearFecha(valor: string): string {
    const fecha = new Date(valor);
    if (Number.isNaN(fecha.getTime())) {
      return valor;
    }
    return fecha.toLocaleString('es-ES', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  }

  protected formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(precio);
  }

  private cargarLanzamientos(): void {
    this.estadoCarga.set('loading');
    this.servicio.listar().subscribe({
      next: (lista) => {
        this.estadoCarga.set('success');
        this.lanzamientos.set(lista);
        this.lanzamientoSeleccionado.set(lista[0] ?? null);
        this.mostrarFormularioReserva.set(false);
        this.aviso.set(null);
      },
      error: (error) => {
        this.estadoCarga.set('error');
        this.aviso.set({
          texto: extraerMensajeErrorApi(error, 'Error al cargar los lanzamientos'),
          esError: true,
        });
      },
    });
  }

  private recargarTrasOperacion(idSeleccionado: string): void {
    this.servicio.listar().subscribe({
      next: (lista) => {
        this.lanzamientos.set(lista);
        const detalle = lista.find((lanzamiento) => lanzamiento.id === idSeleccionado) ?? null;
        this.lanzamientoSeleccionado.set(detalle);
      },
      error: (error) => {
        this.aviso.set({
          texto: extraerMensajeErrorApi(error, 'Error al refrescar lanzamientos'),
          esError: true,
        });
      },
    });
  }

  private ejecutarCambioEstado(
    lanzamientoId: string,
    estadoDestino: EstadoLanzamiento,
    motivo: string | null,
  ): void {
    this.servicio
      .cambiarEstado(lanzamientoId, {
        estado: estadoDestino,
        motivo: motivo ?? undefined,
      })
      .subscribe({
        next: (actualizado) => {
          this.cerrarModalCambioEstado();
          this.recargarTrasOperacion(actualizado.id);
          this.aviso.set({ texto: `Estado cambiado a ${estadoDestino}`, esError: false });
        },
        error: (error) => {
          const mensaje = extraerMensajeErrorApi(error, 'No se pudo cambiar el estado del lanzamiento');
          if (this.modalCambioEstado()) {
            this.errorModalCambioEstado.set(mensaje);
            this.motivoInputRef()?.nativeElement.focus();
            return;
          }

          this.aviso.set({ texto: mensaje, esError: true });
        },
      });
  }
}
