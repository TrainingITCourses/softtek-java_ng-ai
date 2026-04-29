package academy.aicode.astrobookings.reservas;

import org.springframework.stereotype.Repository;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
public class InMemoryReservaRepository implements ReservaRepository {

    private final Map<UUID, Reserva> almacen = new LinkedHashMap<>();

    @Override
    public Reserva guardar(Reserva reserva) {
        almacen.put(reserva.id(), reserva);
        return reserva;
    }

    @Override
    public List<Reserva> listarPorLanzamiento(UUID lanzamientoId) {
        return almacen.values().stream()
                .filter(reserva -> reserva.lanzamientoId().equals(lanzamientoId))
                .toList();
    }
}
