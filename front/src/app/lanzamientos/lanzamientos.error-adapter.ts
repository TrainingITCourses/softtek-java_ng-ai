import { HttpErrorResponse } from '@angular/common/http';
import { ErrorApi } from './lanzamiento.model';

function esErrorApi(valor: unknown): valor is ErrorApi {
  if (!valor || typeof valor !== 'object') {
    return false;
  }

  const posibleError = valor as Record<string, unknown>;
  return (
    typeof posibleError['code'] === 'string' &&
    typeof posibleError['error'] === 'string' &&
    typeof posibleError['message'] === 'string'
  );
}

export function extraerMensajeErrorApi(error: unknown, mensajePorDefecto: string): string {
  if (error instanceof HttpErrorResponse && esErrorApi(error.error)) {
    return error.error.message;
  }
  return mensajePorDefecto;
}
