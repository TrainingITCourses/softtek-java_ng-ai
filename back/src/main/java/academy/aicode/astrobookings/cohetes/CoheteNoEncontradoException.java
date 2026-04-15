package academy.aicode.astrobookings.cohetes;

import java.util.UUID;

public class CoheteNoEncontradoException extends RuntimeException {
    public CoheteNoEncontradoException(UUID id) {
        super("Cohete no encontrado: " + id);
    }
}
