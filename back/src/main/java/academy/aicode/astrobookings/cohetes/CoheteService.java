package academy.aicode.astrobookings.cohetes;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CoheteService {

    private static final int NOMBRE_MIN = 3;
    private static final int NOMBRE_MAX = 10;
    private static final int CAPACIDAD_MIN = 1;
    private static final int CAPACIDAD_MAX = 9;

    private final CoheteRepository repositorio;

    public CoheteService(CoheteRepository repositorio) {
        this.repositorio = repositorio;
    }

    public List<Cohete> listar() {
        return repositorio.listarActivos();
    }

    public Cohete obtener(UUID id) {
        return buscarActivo(id);
    }

    public Cohete crear(CohetePeticion peticion) {
        validar(peticion);
        if (repositorio.existeNombre(peticion.nombre())) {
            throw new CoheteNombreDuplicadoException(peticion.nombre());
        }
        return repositorio.guardar(Cohete.crear(peticion.nombre(), peticion.capacidad(), peticion.rango()));
    }

    public Cohete actualizar(UUID id, CohetePeticion peticion) {
        validar(peticion);
        Cohete existente = buscarActivo(id);
        if (repositorio.existeNombreExcluyendo(peticion.nombre(), id)) {
            throw new CoheteNombreDuplicadoException(peticion.nombre());
        }
        return repositorio.guardar(existente.actualizar(peticion.nombre(), peticion.capacidad(), peticion.rango()));
    }

    public void darDeBaja(UUID id) {
        repositorio.guardar(buscarActivo(id).darDeBaja());
    }

    private Cohete buscarActivo(UUID id) {
        return repositorio.buscarPorId(id)
                .filter(Cohete::activo)
                .orElseThrow(() -> new CoheteNoEncontradoException(id));
    }

    private void validar(CohetePeticion peticion) {
        if (peticion.nombre() == null
                || peticion.nombre().length() < NOMBRE_MIN
                || peticion.nombre().length() > NOMBRE_MAX) {
            throw new CoheteValidacionException(
                    String.format("El nombre debe tener entre %d y %d caracteres", NOMBRE_MIN, NOMBRE_MAX));
        }
        if (peticion.capacidad() < CAPACIDAD_MIN || peticion.capacidad() > CAPACIDAD_MAX) {
            throw new CoheteValidacionException(
                    String.format("La capacidad debe estar entre %d y %d", CAPACIDAD_MIN, CAPACIDAD_MAX));
        }
        if (peticion.rango() == null) {
            throw new CoheteValidacionException("El rango es obligatorio (Tierra, Luna, Marte)");
        }
    }
}
