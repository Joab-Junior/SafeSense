import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AccountAuthHandleService } from '../services/AccountHandle/account-auth-handle.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AccountAuthHandleService,
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('refresh-token.php')) {
      return next.handle(req);
    }

    // Token atual
    const token = this.authService.getToken();

    // Clona a requisição com o token (se houver)
    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Envia a requisição normalmente
    return next.handle(authReq).pipe(
      catchError(error => {
        // Se for 401 (não autorizado)
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // Se o token está expirado ou prestes a expirar, tenta renovar
          if (this.authService.isTokenExpired() || this.authService.isTokenExpiringSoon()) {
            return this.authService.refreshToken().pipe(
              switchMap(newToken => {
                // Reenvia a mesma requisição com o novo token
                const clonedReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newToken}`
                  }
                });
                return next.handle(clonedReq);
              }),
              catchError(() => {
                // Falhou o refresh → faz logout
                this.authService.logout();
                this.router.navigate(['/entrar']);
                return throwError(() => new Error('Sessão expirada.'));
              })
            );
          }
        }

        return throwError(() => error); // Outro erro qualquer
      })
    );
  }
}