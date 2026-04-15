import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SaludoRespuesta, SaludoService } from './saludo.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
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
  `],
  template: `
    @if (saludo()) {
      <main>
        <h1>{{ saludo()!.aplicacion }}</h1>
        <p><span class="estado">&#10003; {{ saludo()!.estado }}</span></p>
        <p class="timestamp">{{ fechaFormateada() }}</p>
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
