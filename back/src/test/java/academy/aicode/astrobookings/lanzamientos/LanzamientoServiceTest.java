package academy.aicode.astrobookings.lanzamientos;

import academy.aicode.astrobookings.cohetes.Cohete;
import academy.aicode.astrobookings.cohetes.CohetePeticion;
import academy.aicode.astrobookings.cohetes.CoheteRepository;
import academy.aicode.astrobookings.cohetes.CoheteService;
import academy.aicode.astrobookings.cohetes.Rango;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class LanzamientoServiceTest {

    private CoheteService coheteService;
    private LanzamientoService lanzamientoService;

    @BeforeEach
    void setUp() {
        CoheteRepository coheteRepository = new CoheteRepository();
        coheteService = new CoheteService(coheteRepository);
        lanzamientoService = new LanzamientoService(new InMemoryLanzamientoRepository(), coheteService);
    }

    @Test
    void crear_asigna_estado_inicial_programado() {
        Cohete cohete = crearCoheteActivo();

        Lanzamiento resultado = lanzamientoService.crear(peticionValida(cohete.id()));

        assertThat(resultado.estado()).isEqualTo(EstadoLanzamiento.Programado);
    }

    @Test
    void crear_rechaza_cohete_inexistente() {
        LanzamientoPeticion peticion = peticionValida(UUID.randomUUID());

        assertThatThrownBy(() -> lanzamientoService.crear(peticion))
                .isInstanceOf(LanzamientoValidacionException.class)
                .hasMessageContaining("no existe o está inactivo");
    }

    @Test
    void crear_rechaza_cohete_inactivo() {
        Cohete cohete = crearCoheteActivo();
        coheteService.darDeBaja(cohete.id());

        assertThatThrownBy(() -> lanzamientoService.crear(peticionValida(cohete.id())))
                .isInstanceOf(LanzamientoValidacionException.class)
                .hasMessageContaining("no existe o está inactivo");
    }

    @Test
    void cambiar_estado_suspendido_sin_motivo_rechaza_operacion() {
        Cohete cohete = crearCoheteActivo();
        Lanzamiento lanzamiento = lanzamientoService.crear(peticionValida(cohete.id()));

        assertThatThrownBy(() -> lanzamientoService.cambiarEstado(
                lanzamiento.id(),
                new CambioEstadoLanzamientoPeticion(EstadoLanzamiento.Suspendido, " ")))
                .isInstanceOf(LanzamientoValidacionException.class)
                .hasMessageContaining("motivo es obligatorio");
    }

    @Test
    void cambiar_estado_cancelado_lo_vuelve_terminal() {
        Cohete cohete = crearCoheteActivo();
        Lanzamiento lanzamiento = lanzamientoService.crear(peticionValida(cohete.id()));

        lanzamientoService.cambiarEstado(
                lanzamiento.id(),
                new CambioEstadoLanzamientoPeticion(EstadoLanzamiento.Cancelado, "Incidencia crítica"));

        assertThatThrownBy(() -> lanzamientoService.cambiarEstado(
                lanzamiento.id(),
                new CambioEstadoLanzamientoPeticion(EstadoLanzamiento.Programado, null)))
                .isInstanceOf(LanzamientoTransicionInvalidaException.class);
    }

    @Test
    void suspendido_permite_reactivar_a_programado_o_confirmado() {
        Cohete cohete = crearCoheteActivo();
        Lanzamiento lanzamiento = lanzamientoService.crear(peticionValida(cohete.id()));

        Lanzamiento suspendido = lanzamientoService.cambiarEstado(
                lanzamiento.id(),
                new CambioEstadoLanzamientoPeticion(EstadoLanzamiento.Suspendido, "Viento fuerte"));

        Lanzamiento reprogramado = lanzamientoService.cambiarEstado(
                suspendido.id(),
                new CambioEstadoLanzamientoPeticion(EstadoLanzamiento.Programado, null));

        Lanzamiento confirmado = lanzamientoService.cambiarEstado(
                reprogramado.id(),
                new CambioEstadoLanzamientoPeticion(EstadoLanzamiento.Confirmado, null));

        assertThat(confirmado.estado()).isEqualTo(EstadoLanzamiento.Confirmado);
        assertThat(confirmado.motivo()).isNull();
    }

    private Cohete crearCoheteActivo() {
        return coheteService.crear(new CohetePeticion("Atlas", 5, Rango.Tierra));
    }

    private LanzamientoPeticion peticionValida(UUID coheteId) {
        return new LanzamientoPeticion(
                coheteId,
                OffsetDateTime.parse("2026-07-20T12:00:00Z"),
                new BigDecimal("1999.90"));
    }
}