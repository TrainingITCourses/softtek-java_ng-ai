package academy.aicode.astrobookings.lanzamientos;

import org.springframework.stereotype.Repository;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Repository
public class InMemoryLanzamientoRepository implements LanzamientoRepository {

    private final Map<UUID, Lanzamiento> almacen = new LinkedHashMap<>();

    @Override
    public List<Lanzamiento> listarTodos() {
        return almacen.values().stream().toList();
    }

    @Override
    public List<Lanzamiento> listarActivos() {
        return almacen.values().stream()
                .filter(Lanzamiento::activo)
                .toList();
    }

    @Override
    public Optional<Lanzamiento> buscarPorId(UUID id) {
        return Optional.ofNullable(almacen.get(id));
    }

    @Override
    public Lanzamiento guardar(Lanzamiento lanzamiento) {
        almacen.put(lanzamiento.id(), lanzamiento);
        return lanzamiento;
    }
}