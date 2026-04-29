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
        int capacidadCohete = obtenerCapacidadCoheteActivo(peticion.coheteId());
        return repositorio.guardar(Lanzamiento.crear(peticion.coheteId(), peticion.fecha(), peticion.precio(), capacidadCohete));
    }

    public Lanzamiento actualizar(UUID id, LanzamientoPeticion peticion) {
        validarPeticion(peticion);
        int capacidadCohete = obtenerCapacidadCoheteActivo(peticion.coheteId());
        Lanzamiento existente = buscarActivo(id);
        int plazasReservadas = existente.capacidadTotal() - existente.plazasDisponibles();
        if (capacidadCohete < plazasReservadas) {
            throw new LanzamientoValidacionException("La capacidad del nuevo cohete no alcanza para las plazas ya reservadas");
        }

        return repositorio.guardar(existente.actualizar(peticion.coheteId(), peticion.fecha(), peticion.precio(), capacidadCohete));
    }

    public void darDeBaja(UUID id) {
        repositorio.guardar(buscarActivo(id).darDeBaja());
    }

    public Lanzamiento cambiarEstado(UUID id, CambioEstadoLanzamientoPeticion peticion) {
        if (peticion == null || peticion.estado() == null) {
            throw new LanzamientoValidacionException("El estado destino es obligatorio");
        }
        Lanzamiento existente = buscarActivo(id);
        validarMotivoParaIncidencia(peticion.estado(), peticion.motivo());
        validarTransicion(existente, peticion.estado());

        String motivo = construirMotivoPersistido(peticion.estado(), peticion.motivo());
        return repositorio.guardar(existente.cambiarEstado(peticion.estado(), motivo));
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

    private int obtenerCapacidadCoheteActivo(UUID coheteId) {
        try {
            return coheteService.obtener(coheteId).capacidad();
        } catch (CoheteNoEncontradoException ex) {
            throw new LanzamientoValidacionException("El cohete asignado no existe o está inactivo: " + coheteId);
        }
    }

    private void validarMotivoParaIncidencia(EstadoLanzamiento estadoDestino, String motivo) {
        if (requiereMotivo(estadoDestino) && (motivo == null || motivo.isBlank())) {
            throw new LanzamientoValidacionException("El motivo es obligatorio para estados Suspendido y Cancelado");
        }
        if (estadoDestino == EstadoLanzamiento.Suspendido && !esMotivoSuspendidoValido(motivo)) {
            throw new LanzamientoValidacionException("Para suspender, el motivo debe ser CLIMA o TECNOLOGIA");
        }
    }

    private boolean requiereMotivo(EstadoLanzamiento estadoDestino) {
        return estadoDestino == EstadoLanzamiento.Suspendido || estadoDestino == EstadoLanzamiento.Cancelado;
    }

    private String construirMotivoPersistido(EstadoLanzamiento estadoDestino, String motivo) {
        if (!requiereMotivo(estadoDestino)) {
            return null;
        }
        if (estadoDestino == EstadoLanzamiento.Suspendido) {
            return normalizarMotivoSuspendido(motivo);
        }
        return motivo.trim();
    }

    private boolean esMotivoSuspendidoValido(String motivo) {
        String valor = normalizarMotivoSuspendido(motivo);
        return "CLIMA".equals(valor) || "TECNOLOGIA".equals(valor);
    }

    private String normalizarMotivoSuspendido(String motivo) {
        return motivo == null ? "" : motivo.trim().toUpperCase();
    }

    private void validarTransicion(Lanzamiento lanzamiento, EstadoLanzamiento estadoDestino) {
        EstadoLanzamiento estadoActual = lanzamiento.estado();

        if (estadoActual == EstadoLanzamiento.Cancelado && estadoDestino != EstadoLanzamiento.Cancelado) {
            throw new LanzamientoTransicionInvalidaException(lanzamiento.id(), estadoActual, estadoDestino);
        }
        if (estadoActual == estadoDestino) {
            return;
        }

        boolean transicionValida = switch (estadoActual) {
            case Programado -> estadoDestino == EstadoLanzamiento.Confirmado
                    || estadoDestino == EstadoLanzamiento.Suspendido
                    || estadoDestino == EstadoLanzamiento.Cancelado;
            case Confirmado -> estadoDestino == EstadoLanzamiento.Completado
                    || estadoDestino == EstadoLanzamiento.Suspendido
                    || estadoDestino == EstadoLanzamiento.Cancelado;
            case Completado -> false;
            case Suspendido -> estadoDestino == EstadoLanzamiento.Programado
                    || estadoDestino == EstadoLanzamiento.Confirmado
                    || estadoDestino == EstadoLanzamiento.Cancelado;
            case Cancelado -> false;
        };

        if (!transicionValida) {
            throw new LanzamientoTransicionInvalidaException(lanzamiento.id(), estadoActual, estadoDestino);
        }
    }
}