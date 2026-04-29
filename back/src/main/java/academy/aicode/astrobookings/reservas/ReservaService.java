package academy.aicode.astrobookings.reservas;

import academy.aicode.astrobookings.lanzamientos.EstadoLanzamiento;
import academy.aicode.astrobookings.lanzamientos.Lanzamiento;
import academy.aicode.astrobookings.lanzamientos.LanzamientoRepository;
import academy.aicode.astrobookings.lanzamientos.LanzamientoService;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class ReservaService {

    private static final Pattern EMAIL_REGEX = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    private static final Pattern TELEFONO_REGEX = Pattern.compile("^\\+?\\d{7,15}$");

    private final ReservaRepository reservaRepository;
    private final LanzamientoService lanzamientoService;
    private final LanzamientoRepository lanzamientoRepository;

    public ReservaService(
            ReservaRepository reservaRepository,
            LanzamientoService lanzamientoService,
            LanzamientoRepository lanzamientoRepository) {
        this.reservaRepository = reservaRepository;
        this.lanzamientoService = lanzamientoService;
        this.lanzamientoRepository = lanzamientoRepository;
    }

    public Reserva crear(UUID lanzamientoId, ReservaPeticion peticion) {
        validarPeticion(peticion);

        Lanzamiento lanzamiento = lanzamientoService.obtener(lanzamientoId);
        validarEstadoPermitido(lanzamiento);
        validarPlazasDisponibles(lanzamiento);

        Reserva reserva = reservaRepository.guardar(
                Reserva.crear(lanzamiento.id(), peticion.nombre(), peticion.email(), peticion.telefono()));

        lanzamientoRepository.guardar(lanzamiento.descontarPlaza());
        return reserva;
    }

    private void validarEstadoPermitido(Lanzamiento lanzamiento) {
        if (lanzamiento.estado() != EstadoLanzamiento.Programado && lanzamiento.estado() != EstadoLanzamiento.Confirmado) {
            throw new ReservaEstadoNoPermitidoException(lanzamiento.id(), lanzamiento.estado());
        }
    }

    private void validarPlazasDisponibles(Lanzamiento lanzamiento) {
        if (lanzamiento.plazasDisponibles() <= 0) {
            throw new ReservaSinPlazasException(lanzamiento.id());
        }
    }

    private void validarPeticion(ReservaPeticion peticion) {
        if (peticion == null) {
            throw new ReservaValidacionException("La petición es obligatoria");
        }

        validarNombre(peticion.nombre());
        validarEmail(peticion.email());
        validarTelefono(peticion.telefono());
    }

    private void validarNombre(String nombre) {
        if (estaVacio(nombre)) {
            throw new ReservaValidacionException("El nombre es obligatorio");
        }
    }

    private void validarEmail(String email) {
        if (estaVacio(email) || !EMAIL_REGEX.matcher(email.trim()).matches()) {
            throw new ReservaValidacionException("El email no es válido");
        }
    }

    private void validarTelefono(String telefono) {
        if (estaVacio(telefono) || !TELEFONO_REGEX.matcher(telefono.trim()).matches()) {
            throw new ReservaValidacionException("El teléfono debe tener entre 7 y 15 dígitos, con prefijo + opcional");
        }
    }

    private boolean estaVacio(String valor) {
        return valor == null || valor.isBlank();
    }
}
