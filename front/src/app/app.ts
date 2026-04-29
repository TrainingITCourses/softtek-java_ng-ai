import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SaludoRespuesta, SaludoService } from './saludo.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    main { font-family: sans-serif; padding: 2rem; }
    h1 { text-transform: capitalize; }
    .estado {
      display: inline-block;
      background: #22c55e;
      color: white;
      font-weight: bold;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      margin: 0.5rem 0;
    }
    .timestamp { color: #6b7280; font-size: 0.875rem; margin-top: 0.5rem; }
    .nav-home { margin-top: 1rem; }
    .nav-link {
      display: inline-block;
      text-decoration: none;
      border: 1px solid #1d4ed8;
      color: #1d4ed8;
      padding: 0.375rem 0.75rem;
      border-radius: 0.5rem;
      font-weight: 600;
      margin-right: 0.5rem;
    }
    .nav-link:hover { background: #dbeafe; }
  `],
  template: `
    @if (saludo()) {
      <main>
        <h1>{{ saludo()!.aplicacion }}</h1>
        <p><span class="estado">&#10003; {{ saludo()!.estado }}</span></p>
        <p class="timestamp">{{ fechaFormateada() }}</p>
        <p class="nav-home">
          <a class="nav-link" routerLink="/cohetes">Volver al home</a>
          <a class="nav-link" routerLink="/lanzamientos">Ir a la lista de lanzamientos</a>
        </p>
      </main>
    } @else {
      <p>Cargando...</p>
    }
    <router-outlet />
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

  ngOnInit(): void {
    this.saludoService.obtenerSaludo().subscribe((respuesta) => {
      this.saludo.set(respuesta);
    });
  }
}
