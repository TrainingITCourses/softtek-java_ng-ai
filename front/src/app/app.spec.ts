import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { App } from './app';
import { SaludoService } from './saludo.service';

describe('App', () => {
  const saludoServiceMock = {
    obtenerSaludo: vi.fn(() =>
      of({
        aplicacion: 'AstroBookings',
        estado: 'ok',
        timestamp: '2026-04-29T12:00:00Z',
      }),
    ),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: SaludoService, useValue: saludoServiceMock },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('renderiza el titulo del panel principal', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('AstroBookings');
  });

  it('muestra navegacion principal con tres accesos', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const enlaces = [...compiled.querySelectorAll('nav a')].map((a) => a.textContent?.trim());
    expect(enlaces).toEqual(['Cohetes', 'Lanzamientos', 'Reservas']);
  });

  it('muestra estado operativo cuando el backend responde ok', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.status-pill')?.textContent).toContain('Sistema operativo');
  });
});
