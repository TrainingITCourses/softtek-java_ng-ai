package academy.aicode.astrobookings.cohetes;

public class CoheteNombreDuplicadoException extends RuntimeException {
    public CoheteNombreDuplicadoException(String nombre) {
        super("Ya existe un cohete activo con el nombre: " + nombre);
    }
}
