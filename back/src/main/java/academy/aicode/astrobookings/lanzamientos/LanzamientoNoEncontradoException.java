package academy.aicode.astrobookings.lanzamientos;

import java.util.UUID;

public class LanzamientoNoEncontradoException extends RuntimeException {
    public LanzamientoNoEncontradoException(UUID id) {
        super("Lanzamiento no encontrado: " + id);
    }
}