import { HttpErrorResponse } from '@angular/common/module.d-CnjH8Dlt';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }

  // TRATAMENTO DE ERROS
  public handleError(error: HttpErrorResponse) {
    let message = 'Erro desconhecido.';

    // Caso o backend tenha retornado uma resposta com JSON
    if (error.error) {
      // Se veio como string (ex: JSON bruto)
      if (typeof error.error === 'string') {
        try {
          const parsed = JSON.parse(error.error);
          message = parsed.message || message;
        } catch {
          message = error.error; // Caso não seja JSON válido
        }
      }
      // Se já veio como objeto (Angular já parseou)
      else if (typeof error.error === 'object' && error.error.message) {
        message = error.error.message;
      }
    }
    // Erro do lado do cliente
    else if (error.error instanceof ErrorEvent) {
      message = `Erro no cliente: ${error.error.message}`;
    }

    console.error('Erro capturado:', error); // <-- Ajuda a depurar melhor
    return throwError(() => new Error(message));
  }
}
