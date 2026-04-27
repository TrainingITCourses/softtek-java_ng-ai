package academy.aicode.astrobookings.lanzamientos;

import academy.aicode.astrobookings.cohetes.CoheteNoEncontradoException;
import academy.aicode.astrobookings.cohetes.CoheteService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class LanzamientoService {

    private final LanzamientoRepository repositorio;
    private final CoheteService coheteService;

    public LanzamientoService(LanzamientoRepository repositorio, CoheteService coheteService) {
        this.repositorio = repositorio;
        this.coheteService = coheteService;
    }

    public List<Lanzamiento> listar() {
        return repositorio.listarActivos();
    }

    public Lanzamiento obtener(UUID id) {
        return buscarActivo(id);
    }

    public Lanzamiento crear(LanzamientoPeticion peticion) {
        validarPeticion(peticion);
        validarCoheteActivo(peticion.coheteId());
        return repositorio.guardar(Lanzamiento.crear(peticion.coheteId(), peticion.fecha(), peticion.precio()));
    }

    public Lanzamiento actualizar(UUID id, LanzamientoPeticion peticion) {
        validarPeticion(peticion);
        validarCoheteActivo(peticion.coheteId());
        Lanzamiento existente = buscarActivo(id);
        return repositorio.guardar(existente.actualizar(peticion.coheteId(), peticion.fecha(), peticion.precio()));
    }

    public void darDeBaja(UUID id) {
        repositorio.guardar(buscarActivo(id).darDeBaja());
    }

    public Lanzamiento cambiarEstado(UUID id, CambioEstadoLanzamientoPeticion peticion) {
        if (peticion == null || peticion.estado() == null) {
            throw new LanzamientoValidacionException("El estado destino es obligatorio");
        }
        Lanzamiento existente = buscarActivo(id);
        return repositorio.guardar(existente.cambiarEstado(peticion.estado(), peticion.motivo()));
    }

    private Lanzamiento buscarActivo(UUID id) {
        return repositorio.buscarPorId(id)
                .filter(Lanzamiento::activo)
                .orElseThrow(() -> new LanzamientoNoEncontradoException(id));
    }

    private void validarPeticion(LanzamientoPeticion peticion) {
        if (peticion == null) {
            throw new LanzamientoValidacionException("La petición es obligatoria");
        }
        if (peticion.coheteId() == null) {
            throw new LanzamientoValidacionException("El coheteId es obligatorio");
        }
        if (peticion.fecha() == null) {
            throw new LanzamientoValidacionException("La fecha es obligatoria");
        }
        if (peticion.precio() == null || peticion.precio().compareTo(BigDecimal.ZERO) <= 0) {
            throw new LanzamientoValidacionException("El precio debe ser mayor que 0");
        }
    }

    private void validarCoheteActivo(UUID coheteId) {
        try {
            coheteService.obtener(coheteId);
        } catch (CoheteNoEncontradoException ex) {
            throw new LanzamientoValidacionException("El cohete asignado no existe o está inactivo: " + coheteId);
        }
    }
}