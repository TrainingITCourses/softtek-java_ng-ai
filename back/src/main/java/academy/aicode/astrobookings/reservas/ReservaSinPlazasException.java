package academy.aicode.astrobookings.reservas;

import java.util.UUID;

public class ReservaSinPlazasException extends RuntimeException {

    public ReservaSinPlazasException(UUID lanzamientoId) {
        super("No hay plazas disponibles para el lanzamiento " + lanzamientoId);
    }
}
