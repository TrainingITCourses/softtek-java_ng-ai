package academy.aicode.astrobookings.lanzamientos;

import academy.aicode.astrobookings.cohetes.Cohete;
import academy.aicode.astrobookings.cohetes.CohetePeticion;
import academy.aicode.astrobookings.cohetes.CoheteRepository;
import academy.aicode.astrobookings.cohetes.CoheteService;
import academy.aicode.astrobookings.cohetes.Rango;
import academy.aicode.astrobookings.reservas.InMemoryReservaRepository;
import academy.aicode.astrobookings.reservas.ReservaService;
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
        InMemoryLanzamientoRepository lanzamientoRepository = new InMemoryLanzamientoRepository();
        LanzamientoService lanzamientoService = new LanzamientoService(lanzamientoRepository, coheteService);
        ReservaService reservaService = new ReservaService(
                new InMemoryReservaRepository(),
                lanzamientoService,
                lanzamientoRepository);
        LanzamientoController controller = new LanzamientoController(lanzamientoService, reservaService);

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
                        .header("X-Rol", "OPERACIONES")
                        .contentType(APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("400"))
                .andExpect(jsonPath("$.error").value("validation_failed"))
                .andExpect(jsonPath("$.message").isNotEmpty());
    }

    @Test
    void cambiar_estado_suspendido_con_motivo_fuera_catalogo_devuelve_error_estructurado() throws Exception {
        String lanzamientoId = crearLanzamientoYDevolverId();
        String body = "{\"estado\":\"Suspendido\",\"motivo\":\"INCIDENCIA\"}";

        mockMvc.perform(post("/api/lanzamientos/{id}/state", lanzamientoId)
                        .header("X-Rol", "OPERACIONES")
                        .contentType(APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("400"))
                .andExpect(jsonPath("$.error").value("validation_failed"))
                .andExpect(jsonPath("$.message").isNotEmpty());
    }

    @Test
    void cambiar_estado_suspendido_sin_rol_operaciones_devuelve_403() throws Exception {
        String lanzamientoId = crearLanzamientoYDevolverId();
        String body = "{\"estado\":\"Suspendido\",\"motivo\":\"CLIMA\"}";

        mockMvc.perform(post("/api/lanzamientos/{id}/state", lanzamientoId)
                        .header("X-Rol", "COMERCIAL")
                        .contentType(APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("403"))
                .andExpect(jsonPath("$.error").value("forbidden"));
    }

    @Test
    void cambiar_estado_suspendido_con_rol_operaciones_y_motivo_catalogado_devuelve_ok() throws Exception {
        String lanzamientoId = crearLanzamientoYDevolverId();
        String body = "{\"estado\":\"Suspendido\",\"motivo\":\"TECNOLOGIA\"}";

        mockMvc.perform(post("/api/lanzamientos/{id}/state", lanzamientoId)
                        .header("X-Rol", "OPERACIONES")
                        .contentType(APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("Suspendido"))
                .andExpect(jsonPath("$.motivo").value("TECNOLOGIA"));
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

            @Test
            void crear_reserva_valida_devuelve_201_y_luego_sin_plazas_devuelve_409() throws Exception {
            String lanzamientoId = crearLanzamientoYDevolverId(2);

            mockMvc.perform(post("/api/lanzamientos/{id}/reservas", lanzamientoId)
                    .contentType(APPLICATION_JSON)
                    .content(jsonCrearReserva("Ada", "ada@example.com", "+34123456789")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.plazas").value(1))
                .andExpect(jsonPath("$.activa").value(true));

            mockMvc.perform(post("/api/lanzamientos/{id}/reservas", lanzamientoId)
                    .contentType(APPLICATION_JSON)
                    .content(jsonCrearReserva("Linus", "linus@example.com", "123456789")))
                .andExpect(status().isCreated());

            mockMvc.perform(post("/api/lanzamientos/{id}/reservas", lanzamientoId)
                    .contentType(APPLICATION_JSON)
                    .content(jsonCrearReserva("Grace", "grace@example.com", "123456780")))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("409"))
                .andExpect(jsonPath("$.error").value("conflict"));
            }

            @Test
            void crear_reserva_en_estado_no_permitido_devuelve_conflict() throws Exception {
            String lanzamientoId = crearLanzamientoYDevolverId();
            String confirmarBody = "{\"estado\":\"Confirmado\",\"motivo\":null}";
            String completarBody = "{\"estado\":\"Completado\",\"motivo\":null}";

            mockMvc.perform(post("/api/lanzamientos/{id}/state", lanzamientoId)
                    .contentType(APPLICATION_JSON)
                    .content(confirmarBody))
                .andExpect(status().isOk());

            mockMvc.perform(post("/api/lanzamientos/{id}/state", lanzamientoId)
                    .contentType(APPLICATION_JSON)
                    .content(completarBody))
                .andExpect(status().isOk());

            mockMvc.perform(post("/api/lanzamientos/{id}/reservas", lanzamientoId)
                    .contentType(APPLICATION_JSON)
                    .content(jsonCrearReserva("Ada", "ada@example.com", "123456789")))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("409"))
                .andExpect(jsonPath("$.error").value("conflict"));
            }

    private String crearLanzamientoYDevolverId() throws Exception {
        return crearLanzamientoYDevolverId(5);
    }

    private String crearLanzamientoYDevolverId(int capacidadCohete) throws Exception {
        Cohete cohete = coheteService.crear(new CohetePeticion("Atlas", capacidadCohete, Rango.Tierra));
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

    private String jsonCrearReserva(String nombre, String email, String telefono) {
        return String.format(
                "{\"nombre\":\"%s\",\"email\":\"%s\",\"telefono\":\"%s\"}",
                nombre,
                email,
                telefono);
    }
}