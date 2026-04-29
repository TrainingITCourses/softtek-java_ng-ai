import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SaludoRespuesta, SaludoService } from './saludo.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-backdrop" aria-hidden="true"></div>

    <div class="app-shell">
      <header class="command-header mission-panel">
        <div>
          <p class="eyebrow">Mission Control</p>
          <h1>{{ tituloAplicacion() }}</h1>
          <p class="subtitle">Gestion de cohetes, lanzamientos y reservas con enfoque operativo.</p>
        </div>

        <div class="status-cluster">
          <p class="status-pill" [class.online]="estaOperativa()">
            {{ estaOperativa() ? 'Sistema operativo' : 'Sin conexion' }}
          </p>
          @if (fechaFormateada()) {
            <p class="status-time">Actualizado: {{ fechaFormateada() }}</p>
          } @else {
            <p class="status-time">Sincronizando telemetria...</p>
          }
        </div>
      </header>

      <nav class="main-nav mission-panel" aria-label="Navegacion principal">
        <a
          routerLink="/cohetes"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }"
        >
          Cohetes
        </a>
        <a routerLink="/lanzamientos" routerLinkActive="active">Lanzamientos</a>
        <a routerLink="/lanzamientos" fragment="reservas" routerLinkActive="active">Reservas</a>
      </nav>

      <section class="content-zone mission-panel">
        <router-outlet />
      </section>
    </div>
  `,
})
export class App implements OnInit {
  private readonly saludoService = inject(SaludoService);
  protected readonly saludo = signal<SaludoRespuesta | null>(null);

  protected readonly fechaFormateada = computed(() => {
    const ts = this.saludo()?.timestamp;
    if (!ts) return '';
    const fecha = new Date(ts);
    return fecha.toLocaleString('es-ES', {
      dateStyle: 'full',
      timeStyle: 'medium',
    });
  });

  protected readonly tituloAplicacion = computed(
    () => this.saludo()?.aplicacion ?? 'AstroBookings',
  );

  protected readonly estaOperativa = computed(
    () => this.saludo()?.estado.toLowerCase() === 'ok',
  );

  ngOnInit(): void {
    this.saludoService.obtenerSaludo().subscribe((respuesta) => {
      this.saludo.set(respuesta);
    });
  }
}
