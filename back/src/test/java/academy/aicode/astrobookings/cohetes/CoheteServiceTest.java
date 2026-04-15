package academy.aicode.astrobookings.cohetes;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;

class CoheteServiceTest {

    private CoheteRepository repositorio;
    private CoheteService servicio;

    @BeforeEach
    void setUp() {
        repositorio = new CoheteRepository();
        servicio = new CoheteService(repositorio);
    }

    // --- listar ---

    @Test
    void listar_devuelve_lista_vacia_inicialmente() {
        assertThat(servicio.listar()).isEmpty();
    }

    @Test
    void listar_devuelve_solo_cohetes_activos() {
        Cohete activo = repositorio.guardar(Cohete.crear("Atlas", 5, Rango.Tierra));
        Cohete inactivo = repositorio.guardar(Cohete.crear("Baja", 3, Rango.Luna).darDeBaja());

        List<Cohete> resultado = servicio.listar();

        assertThat(resultado).containsExactly(activo);
    }

    // --- obtener ---

    @Test
    void obtener_devuelve_cohete_existente() {
        Cohete cohete = repositorio.guardar(Cohete.crear("Atlas", 5, Rango.Tierra));

        Cohete resultado = servicio.obtener(cohete.id());

        assertThat(resultado).isEqualTo(cohete);
    }

    @Test
    void obtener_lanza_excepcion_si_no_existe() {
        assertThatThrownBy(() -> servicio.obtener(UUID.randomUUID()))
                .isInstanceOf(CoheteNoEncontradoException.class);
    }

    @Test
    void obtener_lanza_excepcion_si_esta_dado_de_baja() {
        Cohete inactivo = repositorio.guardar(Cohete.crear("Atlas", 5, Rango.Tierra).darDeBaja());

        assertThatThrownBy(() -> servicio.obtener(inactivo.id()))
                .isInstanceOf(CoheteNoEncontradoException.class);
    }

    // --- crear ---

    @Test
    void crear_registra_cohete_con_id_generado() {
        CohetePeticion peticion = new CohetePeticion("Atlas", 5, Rango.Tierra);

        Cohete resultado = servicio.crear(peticion);

        assertThat(resultado.id()).isNotNull();
        assertThat(resultado.nombre()).isEqualTo("Atlas");
        assertThat(resultado.capacidad()).isEqualTo(5);
        assertThat(resultado.rango()).isEqualTo(Rango.Tierra);
        assertThat(resultado.activo()).isTrue();
    }

    @Test
    void crear_lanza_excepcion_si_nombre_duplicado() {
        servicio.crear(new CohetePeticion("Atlas", 5, Rango.Tierra));

        assertThatThrownBy(() -> servicio.crear(new CohetePeticion("Atlas", 3, Rango.Luna)))
                .isInstanceOf(CoheteNombreDuplicadoException.class);
    }

    @Test
    void crear_lanza_excepcion_si_nombre_muy_corto() {
        assertThatThrownBy(() -> servicio.crear(new CohetePeticion("AB", 5, Rango.Tierra)))
                .isInstanceOf(CoheteValidacionException.class);
    }

    @Test
    void crear_lanza_excepcion_si_nombre_muy_largo() {
        assertThatThrownBy(() -> servicio.crear(new CohetePeticion("NombreLargo1", 5, Rango.Tierra)))
                .isInstanceOf(CoheteValidacionException.class);
    }

    @Test
    void crear_lanza_excepcion_si_capacidad_cero() {
        assertThatThrownBy(() -> servicio.crear(new CohetePeticion("Atlas", 0, Rango.Tierra)))
                .isInstanceOf(CoheteValidacionException.class);
    }

    @Test
    void crear_lanza_excepcion_si_capacidad_mayor_a_9() {
        assertThatThrownBy(() -> servicio.crear(new CohetePeticion("Atlas", 10, Rango.Tierra)))
                .isInstanceOf(CoheteValidacionException.class);
    }

    @Test
    void crear_lanza_excepcion_si_rango_nulo() {
        assertThatThrownBy(() -> servicio.crear(new CohetePeticion("Atlas", 5, null)))
                .isInstanceOf(CoheteValidacionException.class);
    }

    @Test
    void crear_acepta_nombre_con_exactamente_3_caracteres() {
        Cohete resultado = servicio.crear(new CohetePeticion("Sat", 1, Rango.Luna));
        assertThat(resultado.nombre()).isEqualTo("Sat");
    }

    @Test
    void crear_acepta_nombre_con_exactamente_10_caracteres() {
        Cohete resultado = servicio.crear(new CohetePeticion("NombreLarg", 9, Rango.Marte));
        assertThat(resultado.nombre()).isEqualTo("NombreLarg");
    }

    // --- actualizar ---

    @Test
    void actualizar_modifica_datos_del_cohete() {
        Cohete cohete = servicio.crear(new CohetePeticion("Atlas", 5, Rango.Tierra));

        Cohete resultado = servicio.actualizar(cohete.id(), new CohetePeticion("AtlasV", 7, Rango.Marte));

        assertThat(resultado.id()).isEqualTo(cohete.id());
        assertThat(resultado.nombre()).isEqualTo("AtlasV");
        assertThat(resultado.capacidad()).isEqualTo(7);
        assertThat(resultado.rango()).isEqualTo(Rango.Marte);
    }

    @Test
    void actualizar_permite_mismo_nombre_del_propio_cohete() {
        Cohete cohete = servicio.crear(new CohetePeticion("Atlas", 5, Rango.Tierra));

        assertThatNoException().isThrownBy(() ->
                servicio.actualizar(cohete.id(), new CohetePeticion("Atlas", 8, Rango.Luna)));
    }

    @Test
    void actualizar_lanza_excepcion_si_nombre_de_otro_cohete() {
        servicio.crear(new CohetePeticion("Atlas", 5, Rango.Tierra));
        Cohete segundo = servicio.crear(new CohetePeticion("Falcón", 3, Rango.Luna));

        assertThatThrownBy(() -> servicio.actualizar(segundo.id(), new CohetePeticion("Atlas", 4, Rango.Marte)))
                .isInstanceOf(CoheteNombreDuplicadoException.class);
    }

    @Test
    void actualizar_lanza_excepcion_si_id_no_existe() {
        assertThatThrownBy(() -> servicio.actualizar(UUID.randomUUID(), new CohetePeticion("Atlas", 5, Rango.Tierra)))
                .isInstanceOf(CoheteNoEncontradoException.class);
    }

    // --- darDeBaja ---

    @Test
    void darDeBaja_marca_cohete_como_inactivo() {
        Cohete cohete = servicio.crear(new CohetePeticion("Atlas", 5, Rango.Tierra));

        servicio.darDeBaja(cohete.id());

        assertThat(repositorio.buscarPorId(cohete.id()))
                .isPresent()
                .hasValueSatisfying(c -> assertThat(c.activo()).isFalse());
    }

    @Test
    void darDeBaja_lanza_excepcion_si_id_no_existe() {
        assertThatThrownBy(() -> servicio.darDeBaja(UUID.randomUUID()))
                .isInstanceOf(CoheteNoEncontradoException.class);
    }

    @Test
    void darDeBaja_no_elimina_fisicamente_el_registro() {
        Cohete cohete = servicio.crear(new CohetePeticion("Atlas", 5, Rango.Tierra));

        servicio.darDeBaja(cohete.id());

        assertThat(repositorio.buscarPorId(cohete.id())).isPresent();
    }
}
