package academy.aicode.astrobookings.lanzamientos;

import java.util.UUID;

public class LanzamientoTransicionInvalidaException extends RuntimeException {
    public LanzamientoTransicionInvalidaException(UUID id, EstadoLanzamiento origen, EstadoLanzamiento destino) {
        super("Transición no permitida para lanzamiento " + id + ": " + origen + " -> " + destino);
    }
}