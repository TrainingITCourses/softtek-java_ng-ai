package academy.aicode.astrobookings.lanzamientos;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record Lanzamiento(
        UUID id,
        UUID coheteId,
        OffsetDateTime fecha,
        BigDecimal precio,
        EstadoLanzamiento estado,
        String motivo,
        int capacidadTotal,
        int plazasDisponibles,
        boolean activo) {

    public static Lanzamiento crear(UUID coheteId, OffsetDateTime fecha, BigDecimal precio, int capacidadTotal) {
        return new Lanzamiento(
                UUID.randomUUID(),
                coheteId,
                fecha,
                precio,
                EstadoLanzamiento.Programado,
                null,
                capacidadTotal,
                capacidadTotal,
                true);
    }

    public Lanzamiento actualizar(UUID coheteId, OffsetDateTime fecha, BigDecimal precio, int capacidadTotal) {
        int plazasReservadas = this.capacidadTotal - this.plazasDisponibles;
        int nuevasPlazasDisponibles = capacidadTotal - plazasReservadas;
        return new Lanzamiento(
                this.id,
                coheteId,
                fecha,
                precio,
                this.estado,
                this.motivo,
                capacidadTotal,
                nuevasPlazasDisponibles,
                this.activo);
    }

    public Lanzamiento cambiarEstado(EstadoLanzamiento estado, String motivo) {
        return new Lanzamiento(
                this.id,
                this.coheteId,
                this.fecha,
                this.precio,
                estado,
                motivo,
                this.capacidadTotal,
                this.plazasDisponibles,
                this.activo);
    }

    public Lanzamiento descontarPlaza() {
        return new Lanzamiento(
                this.id,
                this.coheteId,
                this.fecha,
                this.precio,
                this.estado,
                this.motivo,
                this.capacidadTotal,
                this.plazasDisponibles - 1,
                this.activo);
    }

    public Lanzamiento darDeBaja() {
        return new Lanzamiento(
                this.id,
                this.coheteId,
                this.fecha,
                this.precio,
                this.estado,
                this.motivo,
                this.capacidadTotal,
                this.plazasDisponibles,
                false);
    }
}