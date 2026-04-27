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
        boolean activo) {

    public static Lanzamiento crear(UUID coheteId, OffsetDateTime fecha, BigDecimal precio) {
        return new Lanzamiento(UUID.randomUUID(), coheteId, fecha, precio, EstadoLanzamiento.Programado, null, true);
    }

    public Lanzamiento actualizar(UUID coheteId, OffsetDateTime fecha, BigDecimal precio) {
        return new Lanzamiento(this.id, coheteId, fecha, precio, this.estado, this.motivo, this.activo);
    }

    public Lanzamiento cambiarEstado(EstadoLanzamiento estado, String motivo) {
        return new Lanzamiento(this.id, this.coheteId, this.fecha, this.precio, estado, motivo, this.activo);
    }

    public Lanzamiento darDeBaja() {
        return new Lanzamiento(this.id, this.coheteId, this.fecha, this.precio, this.estado, this.motivo, false);
    }
}