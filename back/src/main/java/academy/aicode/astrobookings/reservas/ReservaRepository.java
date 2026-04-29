package academy.aicode.astrobookings.reservas;

import java.util.List;
import java.util.UUID;

public interface ReservaRepository {

    Reserva guardar(Reserva reserva);

    List<Reserva> listarPorLanzamiento(UUID lanzamientoId);
}
