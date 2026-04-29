package academy.aicode.astrobookings.reservas;

import java.util.UUID;

public record Reserva(
        UUID id,
        UUID lanzamientoId,
        String nombre,
        String email,
        String telefono,
        int plazas,
        boolean activa) {

    public static Reserva crear(UUID lanzamientoId, String nombre, String email, String telefono) {
        return new Reserva(
                UUID.randomUUID(),
                lanzamientoId,
                nombre.trim(),
                email.trim(),
                telefono.trim(),
                1,
                true);
    }
}
