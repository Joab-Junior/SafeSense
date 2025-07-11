import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { map } from 'rxjs/operators';
import { ErrorHandlerService } from '../../ErrorService/error-handler.service';
import { AuthHeaderService } from '../../HeaderService/auth-header.service';

export interface AuthAccountData {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  data?: string;
  message?: string;
}

interface JwtPayload {
  exp: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AccountAuthHandleService {

  private apiUrl = environment.apiUrl;
  private loginEndpoint = '/auth/login.php';
  private refreshTokenEndpoint = '/auth/refresh-token.php';
  private tokenKey = 'jwtToken';
  private refreshTokenTimeoutId?: any;
  private logoutTimeout: any = null;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  private loggedInSubject = new BehaviorSubject<boolean>(this.isAuthenticated());

  get isLoggedIn$(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService, private authHeader: AuthHeaderService) { }

  // LOGIN
  login(data: AuthAccountData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}${this.loginEndpoint}`, data, {
      headers: this.authHeader.getAppSecret()
    }).pipe(
      tap(res => {
        if (res.status === 'success' && res.data) {
          localStorage.setItem(this.tokenKey, res.data);
          this.scheduleRefreshToken();
          this.scheduleAutoLogout(res.data);
          this.loggedInSubject.next(true);
        }
      }),
      catchError(this.errorHandler.handleError)
    );
  }

  // LOGOUT
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('last_alert_id');

    if (this.refreshTokenTimeoutId) {
      clearTimeout(this.refreshTokenTimeoutId);
      this.refreshTokenTimeoutId = null;
    }

    if (this.logoutTimeout) {
      clearTimeout(this.logoutTimeout);
      this.logoutTimeout = null;
    }

    this.loggedInSubject.next(false);
  }

  private scheduleAutoLogout(token: string): void {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const now = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = (decoded.exp - now) * 1000;

      if (this.logoutTimeout) {
        clearTimeout(this.logoutTimeout);
      }

      this.logoutTimeout = setTimeout(() => {
        this.logout();
      }, timeUntilExpiry);

      console.log(`Logout automático agendado para ${timeUntilExpiry / 1000} segundos`);
    } catch (e) {
      console.error('Erro ao agendar logout automático:', e);
    }
  }

  // PEGAR TOKEN
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<any>(token);
      return decoded.user_id || null;
    } catch {
      return null;
    }
  }


  // VERIFICAR AUTENTICAÇÃO
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired() && !this.isTokenExpiringSoon(30);
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp < now;
    } catch (e) {
      return true; // se deu erro ao decodificar, assume como expirado
    }
  }

  // Função para agendar o refresh automático
  scheduleRefreshToken() {
    const expiresInMs = this.getTokenExpirationDuration();
    const refreshTimeMs = expiresInMs - (5 * 60 * 1000); // 5 minutos antes de expirar

    if (this.refreshTokenTimeoutId) {
      clearTimeout(this.refreshTokenTimeoutId);
    }

    if (refreshTimeMs <= 0) {
      // Token já expira ou está para expirar em menos de 5 min, tenta refresh imediato
      this.refreshToken().subscribe({
        next: () => this.scheduleRefreshToken(),
        error: () => this.logout()
      });
      return;
    }

    this.refreshTokenTimeoutId = setTimeout(() => {
      this.refreshToken().subscribe({
        next: () => this.scheduleRefreshToken(),
        error: () => this.logout()
      });
    }, refreshTimeMs);
  }

  // Retorna o tempo restante do token em milissegundos
  getTokenExpirationDuration(): number {
    const token = this.getToken();
    if (!token) return 0;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const expMs = decoded.exp * 1000;
      const nowMs = Date.now();
      return expMs - nowMs;
    } catch {
      return 0;
    }
  }

  refreshToken(): Observable<string> {
    const token = this.getToken();
    if (!token) return throwError(() => new Error('Token não encontrado.'));

    if (this.isRefreshing) {
      return new Observable<string>(observer => {
        this.subscribeToRefresh((newToken) => {
          observer.next(newToken);
          observer.complete();
        });
      });
    }

    this.isRefreshing = true;

    return this.http.post<{ status: string, token?: string }>(`${this.apiUrl}${this.refreshTokenEndpoint}`, {}, {
      headers: { Authorization: `Bearer ${token}`, ...this.authHeader.getAppSecret() }
    }).pipe(
      tap(res => {
        if (res.status === 'success' && res.token) {
          localStorage.setItem(this.tokenKey, res.token);
          this.scheduleRefreshToken();
          this.scheduleAutoLogout(res.token);
          this.notifyRefreshSubscribers(res.token);
        }
        this.isRefreshing = false;
      }),
      map(res => {
        if (res.status === 'success' && res.token) {
          return res.token;
        } else {
          throw new Error('Refresh token falhou.');
        }
      }),
      catchError(err => {
        this.isRefreshing = false;
        return throwError(() => err);
      })
    );
  }



  isTokenExpiringSoon(thresholdSeconds = 60): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const now = Math.floor(Date.now() / 1000);
      return (decoded.exp - now) < thresholdSeconds;
    } catch {
      return true;
    }
  }

  subscribeToRefresh(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback);
  }

  notifyRefreshSubscribers(newToken: string) {
    this.refreshSubscribers.forEach(cb => cb(newToken));
    this.refreshSubscribers = [];
  }

  isRefreshInProgress(): boolean {
    return this.isRefreshing;
  }

}