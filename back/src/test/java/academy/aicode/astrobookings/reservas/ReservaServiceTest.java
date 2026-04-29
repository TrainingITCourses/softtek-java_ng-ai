package academy.aicode.astrobookings.reservas;

import academy.aicode.astrobookings.cohetes.Cohete;
import academy.aicode.astrobookings.cohetes.CohetePeticion;
import academy.aicode.astrobookings.cohetes.CoheteRepository;
import academy.aicode.astrobookings.cohetes.CoheteService;
import academy.aicode.astrobookings.cohetes.Rango;
import academy.aicode.astrobookings.lanzamientos.CambioEstadoLanzamientoPeticion;
import academy.aicode.astrobookings.lanzamientos.EstadoLanzamiento;
import academy.aicode.astrobookings.lanzamientos.InMemoryLanzamientoRepository;
import academy.aicode.astrobookings.lanzamientos.Lanzamiento;
import academy.aicode.astrobookings.lanzamientos.LanzamientoPeticion;
import academy.aicode.astrobookings.lanzamientos.LanzamientoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ReservaServiceTest {

    private CoheteService coheteService;
    private LanzamientoService lanzamientoService;
    private ReservaService reservaService;

    @BeforeEach
    void setUp() {
        coheteService = new CoheteService(new CoheteRepository());
        InMemoryLanzamientoRepository lanzamientoRepository = new InMemoryLanzamientoRepository();
        lanzamientoService = new LanzamientoService(lanzamientoRepository, coheteService);
        reservaService = new ReservaService(new InMemoryReservaRepository(), lanzamientoService, lanzamientoRepository);
    }

    @Test
    void crear_reserva_en_programado_descuenta_una_plaza() {
        Lanzamiento lanzamiento = crearLanzamientoActivo(2);

        Reserva reserva = reservaService.crear(
                lanzamiento.id(),
                new ReservaPeticion("Ada Lovelace", "ada@example.com", "+34123456789"));

        Lanzamiento actualizado = lanzamientoService.obtener(lanzamiento.id());
        assertThat(reserva.plazas()).isEqualTo(1);
        assertThat(reserva.activa()).isTrue();
        assertThat(actualizado.plazasDisponibles()).isEqualTo(lanzamiento.plazasDisponibles() - 1);
    }

    @Test
    void crear_reserva_en_confirmado_esta_permitida() {
        Lanzamiento lanzamiento = crearLanzamientoActivo(2);
        lanzamientoService.cambiarEstado(
                lanzamiento.id(),
                new CambioEstadoLanzamientoPeticion(EstadoLanzamiento.Confirmado, null));

        Reserva reserva = reservaService.crear(
                lanzamiento.id(),
                new ReservaPeticion("Grace Hopper", "grace@example.com", "123456789"));

        assertThat(reserva.lanzamientoId()).isEqualTo(lanzamiento.id());
    }

    @Test
    void crear_reserva_en_estado_no_permitido_rechaza_operacion() {
        Lanzamiento lanzamiento = crearLanzamientoActivo(2);
        lanzamientoService.cambiarEstado(
                lanzamiento.id(),
                new CambioEstadoLanzamientoPeticion(EstadoLanzamiento.Cancelado, "Clima"));

        assertThatThrownBy(() -> reservaService.crear(
                lanzamiento.id(),
                new ReservaPeticion("Alan Turing", "alan@example.com", "+44123456789")))
                .isInstanceOf(ReservaEstadoNoPermitidoException.class);
    }

    @Test
    void crear_reserva_sin_plazas_disponibles_rechaza_operacion() {
        Lanzamiento lanzamiento = crearLanzamientoActivo(1);

        reservaService.crear(lanzamiento.id(), new ReservaPeticion("Primero", "uno@example.com", "1234567"));

        assertThatThrownBy(() -> reservaService.crear(
                lanzamiento.id(),
                new ReservaPeticion("Segundo", "dos@example.com", "1234568")))
                .isInstanceOf(ReservaSinPlazasException.class);
    }

    @Test
    void crear_reserva_con_email_invalido_rechaza_peticion() {
        Lanzamiento lanzamiento = crearLanzamientoActivo(1);

        assertThatThrownBy(() -> reservaService.crear(
                lanzamiento.id(),
                new ReservaPeticion("Ada", "correo-invalido", "+34123456789")))
                .isInstanceOf(ReservaValidacionException.class)
                .hasMessageContaining("email");
    }

    private Lanzamiento crearLanzamientoActivo(int capacidadCohete) {
        Cohete cohete = crearCoheteActivo(capacidadCohete);
        return lanzamientoService.crear(new LanzamientoPeticion(
                cohete.id(),
                OffsetDateTime.parse("2026-09-10T10:30:00Z"),
                new BigDecimal("1499.99")));
    }

    private Cohete crearCoheteActivo(int capacidad) {
        return coheteService.crear(new CohetePeticion("Atlas", capacidad, Rango.Tierra));
    }
}
