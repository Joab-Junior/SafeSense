import { Injectable } from '@angular/core';
import { AccountAuthHandleService } from '../AccounAuth/account-auth-handle.service';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from '../../ErrorService/error-handler.service';
import { AuthHeaderService } from '../../HeaderService/auth-header.service';

@Injectable({
  providedIn: 'root'
})
export class DeleteAccountHandleService {

  private apiUrl = environment.apiUrl;
  private deleteAccountEndpoint = '/delete-account.php';

  constructor(private authService: AccountAuthHandleService, private http: HttpClient, private errorHandler: ErrorHandlerService, private authHeader: AuthHeaderService) { }

  deleteAccount(): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('Token não encontrado.'));
    }

    return this.http.delete(`${this.apiUrl}${this.deleteAccountEndpoint}`, {
      headers: { Authorization: `Bearer ${token}`, ...this.authHeader.getAppSecret()}
    }).pipe(
      catchError(this.errorHandler.handleError)
    );
  }
}