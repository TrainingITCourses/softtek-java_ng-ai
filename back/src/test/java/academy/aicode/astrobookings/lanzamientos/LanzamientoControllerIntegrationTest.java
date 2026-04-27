package academy.aicode.astrobookings.lanzamientos;

import academy.aicode.astrobookings.cohetes.Cohete;
import academy.aicode.astrobookings.cohetes.CohetePeticion;
import academy.aicode.astrobookings.cohetes.CoheteRepository;
import academy.aicode.astrobookings.cohetes.CoheteService;
import academy.aicode.astrobookings.cohetes.Rango;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class LanzamientoControllerIntegrationTest {

    private MockMvc mockMvc;
    private CoheteService coheteService;

    @BeforeEach
    void setUp() {
        coheteService = new CoheteService(new CoheteRepository());
        LanzamientoService lanzamientoService =
                new LanzamientoService(new InMemoryLanzamientoRepository(), coheteService);
        LanzamientoController controller = new LanzamientoController(lanzamientoService);

        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void crear_lanzamiento_valido_devuelve_201_y_estado_programado() throws Exception {
        Cohete cohete = coheteService.crear(new CohetePeticion("Atlas", 5, Rango.Tierra));
        String body = jsonCrearLanzamiento(cohete.id(), "2026-09-10T10:30:00Z", "1499.99");

        mockMvc.perform(post("/api/lanzamientos")
                        .contentType(APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.coheteId").value(cohete.id().toString()))
                .andExpect(jsonPath("$.estado").value("Programado"));
    }

    @Test
    void crear_lanzamiento_con_cohete_inexistente_devuelve_error_estructurado() throws Exception {
        String body = jsonCrearLanzamiento(UUID.randomUUID(), "2026-09-10T10:30:00Z", "1499.99");

        mockMvc.perform(post("/api/lanzamientos")
                        .contentType(APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("400"))
                .andExpect(jsonPath("$.error").value("validation_failed"))
                .andExpect(jsonPath("$.message").isNotEmpty());
    }

    @Test
    void cambiar_estado_suspendido_sin_motivo_devuelve_error_estructurado() throws Exception {
        String lanzamientoId = crearLanzamientoYDevolverId();
        String body = "{\"estado\":\"Suspendido\",\"motivo\":\" \"}";

        mockMvc.perform(post("/api/lanzamientos/{id}/state", lanzamientoId)
                        .contentType(APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("400"))
                .andExpect(jsonPath("$.error").value("validation_failed"))
                .andExpect(jsonPath("$.message").isNotEmpty());
    }

    @Test
    void lanzamiento_cancelado_no_permite_nuevas_transiciones() throws Exception {
        String lanzamientoId = crearLanzamientoYDevolverId();
        String cancelarBody = "{\"estado\":\"Cancelado\",\"motivo\":\"Falla técnica\"}";
        String reactivarBody = "{\"estado\":\"Programado\",\"motivo\":null}";

        mockMvc.perform(post("/api/lanzamientos/{id}/state", lanzamientoId)
                        .contentType(APPLICATION_JSON)
                        .content(cancelarBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("Cancelado"));

        mockMvc.perform(post("/api/lanzamientos/{id}/state", lanzamientoId)
                        .contentType(APPLICATION_JSON)
                        .content(reactivarBody))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("409"))
                .andExpect(jsonPath("$.error").value("conflict"));
    }

    private String crearLanzamientoYDevolverId() throws Exception {
        Cohete cohete = coheteService.crear(new CohetePeticion("Atlas", 5, Rango.Tierra));
        String body = jsonCrearLanzamiento(cohete.id(), "2026-09-10T10:30:00Z", "1499.99");

        String respuesta = mockMvc.perform(post("/api/lanzamientos")
                        .contentType(APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Matcher matcher = Pattern.compile("\"id\"\\s*:\\s*\"([^\"]+)\"").matcher(respuesta);
        if (matcher.find()) {
            return matcher.group(1);
        }
        throw new IllegalStateException("No se pudo extraer id de la respuesta: " + respuesta);
    }

    private String jsonCrearLanzamiento(UUID coheteId, String fechaIso, String precio) {
        return String.format(
                "{\"coheteId\":\"%s\",\"fecha\":\"%s\",\"precio\":%s}",
                coheteId,
                fechaIso,
                precio);
    }
}