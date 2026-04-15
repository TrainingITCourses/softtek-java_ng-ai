package academy.aicode.astrobookings;

import java.time.Instant;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class SaludoController {

    @Value("${spring.application.name}")
    private String nombreAplicacion;

    @GetMapping("/saludo")
    public SaludoRespuesta obtenerSaludo() {
        return new SaludoRespuesta(
                nombreAplicacion,
                "servidor operativo",
                Instant.now().toString());
    }

    public record SaludoRespuesta(String aplicacion, String estado, String timestamp) {}
}
