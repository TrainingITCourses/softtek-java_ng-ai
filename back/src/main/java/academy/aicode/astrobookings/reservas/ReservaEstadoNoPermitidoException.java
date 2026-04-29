package academy.aicode.astrobookings.reservas;

import academy.aicode.astrobookings.lanzamientos.EstadoLanzamiento;

import java.util.UUID;

public class ReservaEstadoNoPermitidoException extends RuntimeException {

    public ReservaEstadoNoPermitidoException(UUID lanzamientoId, EstadoLanzamiento estado) {
        super("No se permiten reservas para el lanzamiento " + lanzamientoId + " en estado " + estado);
    }
}
