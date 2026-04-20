package academy.aicode.astrobookings.cohetes;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/cohetes")
public class CoheteController {

    private final CoheteService servicio;

    public CoheteController(CoheteService servicio) {
        this.servicio = servicio;
    }

    @GetMapping
    public List<Cohete> listar() {
        return servicio.listar();
    }

    @GetMapping("/{id}")
    public Cohete obtener(@PathVariable UUID id) {
        return servicio.obtener(id);
    }

    @PostMapping
    public ResponseEntity<Cohete> crear(@RequestBody CohetePeticion peticion) {
        return ResponseEntity.status(HttpStatus.CREATED).body(servicio.crear(peticion));
    }

    @PutMapping("/{id}")
    public Cohete actualizar(@PathVariable UUID id, @RequestBody CohetePeticion peticion) {
        return servicio.actualizar(id, peticion);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> darDeBaja(@PathVariable UUID id) {
        servicio.darDeBaja(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(CoheteNoEncontradoException.class)
    public ResponseEntity<ErrorRespuesta> manejarNoEncontrado(CoheteNoEncontradoException ex) {
        return respuestaError(HttpStatus.NOT_FOUND, "not_found", ex.getMessage());
    }

    @ExceptionHandler(CoheteValidacionException.class)
    public ResponseEntity<ErrorRespuesta> manejarValidacion(CoheteValidacionException ex) {
        return respuestaError(HttpStatus.BAD_REQUEST, "validation_failed", ex.getMessage());
    }

    @ExceptionHandler(CoheteNombreDuplicadoException.class)
    public ResponseEntity<ErrorRespuesta> manejarDuplicado(CoheteNombreDuplicadoException ex) {
        return respuestaError(HttpStatus.CONFLICT, "conflict", ex.getMessage());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorRespuesta> manejarMensajeInvalido(HttpMessageNotReadableException ex) {
        return respuestaError(HttpStatus.BAD_REQUEST, "validation_failed", "Petición no válida: " + ex.getMessage());
    }

    private ResponseEntity<ErrorRespuesta> respuestaError(HttpStatus status, String error, String mensaje) {
        return ResponseEntity.status(status)
                .body(new ErrorRespuesta(String.valueOf(status.value()), error, mensaje));
    }
}
