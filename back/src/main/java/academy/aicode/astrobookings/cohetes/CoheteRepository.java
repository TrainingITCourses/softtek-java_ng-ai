package academy.aicode.astrobookings.cohetes;

import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class CoheteRepository {

    private final Map<UUID, Cohete> almacen = new LinkedHashMap<>();

    public List<Cohete> listarActivos() {
        return almacen.values().stream()
                .filter(Cohete::activo)
                .toList();
    }

    public Optional<Cohete> buscarPorId(UUID id) {
        return Optional.ofNullable(almacen.get(id));
    }

    public boolean existeNombre(String nombre) {
        return almacen.values().stream()
                .filter(Cohete::activo)
                .anyMatch(c -> c.nombre().equalsIgnoreCase(nombre));
    }

    public boolean existeNombreExcluyendo(String nombre, UUID id) {
        return almacen.values().stream()
                .filter(Cohete::activo)
                .filter(c -> !c.id().equals(id))
                .anyMatch(c -> c.nombre().equalsIgnoreCase(nombre));
    }

    public Cohete guardar(Cohete cohete) {
        almacen.put(cohete.id(), cohete);
        return cohete;
    }
}
