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
import { AccountAuthHandleService } from '../services/AccountHandle/AccounAuth/account-auth-handle.service';
import { Router } from '@angular/router';
import { AuthHeaderService } from '../services/HeaderService/auth-header.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AccountAuthHandleService,
    private authHeader: AuthHeaderService,
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('refresh-token.php')) {
      return next.handle(req);
    }

    const token = this.authService.getToken();
    const appSecretHeader = this.authHeader.getAppSecret();

    let headers: { [key: string]: string } = { ...appSecretHeader };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const clonedReq = req.clone({
      setHeaders: headers
    });

    return next.handle(clonedReq).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          if (this.authService.isTokenExpired() || this.authService.isTokenExpiringSoon()) {
            return this.authService.refreshToken().pipe(
              switchMap(newToken => {
                const retryHeaders = {
                  ...appSecretHeader,
                  Authorization: `Bearer ${newToken}`
                };

                const retriedReq = req.clone({
                  setHeaders: retryHeaders
                });

                return next.handle(retriedReq);
              }),
              catchError(() => {
                this.authService.logout();
                this.router.navigate(['/entrar']);
                return throwError(() => new Error('Sessão expirada.'));
              })
            );
          }
        }

        return throwError(() => error);
      })
    );
  }
}