package academy.aicode.astrobookings.lanzamientos;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LanzamientoRepository {

    List<Lanzamiento> listarTodos();

    List<Lanzamiento> listarActivos();

    Optional<Lanzamiento> buscarPorId(UUID id);

    Lanzamiento guardar(Lanzamiento lanzamiento);
}