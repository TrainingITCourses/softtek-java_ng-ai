package academy.aicode.astrobookings.cohetes;

import java.util.UUID;

public record Cohete(
        UUID id,
        String nombre,
        int capacidad,
        Rango rango,
        boolean activo) {

    public static Cohete crear(String nombre, int capacidad, Rango rango) {
        return new Cohete(UUID.randomUUID(), nombre, capacidad, rango, true);
    }

    public Cohete actualizar(String nombre, int capacidad, Rango rango) {
        return new Cohete(this.id, nombre, capacidad, rango, this.activo);
    }

    public Cohete darDeBaja() {
        return new Cohete(this.id, this.nombre, this.capacidad, this.rango, false);
    }
}
