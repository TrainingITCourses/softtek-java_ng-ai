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
        return repositorio.buscarPorId(id)
                .filter(Cohete::activo)
                .orElseThrow(() -> new CoheteNoEncontradoException(id));
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
        Cohete existente = repositorio.buscarPorId(id)
                .filter(Cohete::activo)
                .orElseThrow(() -> new CoheteNoEncontradoException(id));
        if (repositorio.existeNombreExcluyendo(peticion.nombre(), id)) {
            throw new CoheteNombreDuplicadoException(peticion.nombre());
        }
        return repositorio.guardar(existente.actualizar(peticion.nombre(), peticion.capacidad(), peticion.rango()));
    }

    public void darDeBaja(UUID id) {
        Cohete existente = repositorio.buscarPorId(id)
                .filter(Cohete::activo)
                .orElseThrow(() -> new CoheteNoEncontradoException(id));
        repositorio.guardar(existente.darDeBaja());
    }

    private void validar(CohetePeticion peticion) {
        if (peticion.nombre() == null
                || peticion.nombre().length() < NOMBRE_MIN
                || peticion.nombre().length() > NOMBRE_MAX) {
            throw new CoheteValidacionException(
                    "El nombre debe tener entre " + NOMBRE_MIN + " y " + NOMBRE_MAX + " caracteres");
        }
        if (peticion.capacidad() < CAPACIDAD_MIN || peticion.capacidad() > CAPACIDAD_MAX) {
            throw new CoheteValidacionException(
                    "La capacidad debe estar entre " + CAPACIDAD_MIN + " y " + CAPACIDAD_MAX);
        }
        if (peticion.rango() == null) {
            throw new CoheteValidacionException("El rango es obligatorio (Tierra, Luna, Marte)");
        }
    }
}
