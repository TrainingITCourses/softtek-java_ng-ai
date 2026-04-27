package academy.aicode.astrobookings.lanzamientos;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/lanzamientos")
public class LanzamientoController {

    private final LanzamientoService servicio;

    public LanzamientoController(LanzamientoService servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    public List<Lanzamiento> listar() {
        return servicio.listar();
    }

    @GetMapping("/{id}")
    public Lanzamiento obtener(@PathVariable UUID id) {
        return servicio.obtener(id);
    }

    @PostMapping
    public ResponseEntity<Lanzamiento> crear(@RequestBody LanzamientoPeticion peticion) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicio.crear(peticion));
    }

    @PutMapping("/{id}")
    public Lanzamiento actualizar(@PathVariable UUID id, @RequestBody LanzamientoPeticion peticion) {
        return servicio.actualizar(id, peticion);
    }

    @PostMapping("/{id}/state")
    public Lanzamiento cambiarEstado(@PathVariable UUID id, @RequestBody CambioEstadoLanzamientoPeticion peticion) {
        return servicio.cambiarEstado(id, peticion);
    }

    @ExceptionHandler(LanzamientoNoEncontradoException.class)
    public ResponseEntity<ErrorRespuesta> manejarNoEncontrado(LanzamientoNoEncontradoException ex) {
        return respuestaError(HttpStatus.NOT_FOUND, "not_found", ex.getMessage());
    }

    @ExceptionHandler(LanzamientoValidacionException.class)
    public ResponseEntity<ErrorRespuesta> manejarValidacion(LanzamientoValidacionException ex) {
        return respuestaError(HttpStatus.BAD_REQUEST, "validation_failed", ex.getMessage());
    }

    @ExceptionHandler(LanzamientoTransicionInvalidaException.class)
    public ResponseEntity<ErrorRespuesta> manejarTransicionInvalida(LanzamientoTransicionInvalidaException ex) {
        return respuestaError(HttpStatus.CONFLICT, "conflict", ex.getMessage());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorRespuesta> manejarPeticionInvalida(HttpMessageNotReadableException ex) {
        return respuestaError(HttpStatus.BAD_REQUEST, "validation_failed", "Petición no válida: " + ex.getMessage());
    }

    private ResponseEntity<ErrorRespuesta> respuestaError(HttpStatus status, String error, String mensaje) {
        return ResponseEntity.status(status)
                .body(new ErrorRespuesta(String.valueOf(status.value()), error, mensaje));
    }
}