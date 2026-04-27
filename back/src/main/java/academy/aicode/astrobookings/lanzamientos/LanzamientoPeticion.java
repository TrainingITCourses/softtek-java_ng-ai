package academy.aicode.astrobookings.lanzamientos;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record LanzamientoPeticion(UUID coheteId, OffsetDateTime fecha, BigDecimal precio) {}