import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountAuthHandleService } from '../AccountHandle/AccounAuth/account-auth-handle.service';
import { ErrorHandlerService } from '../ErrorService/error-handler.service';
import { AuthHeaderService } from '../HeaderService/auth-header.service';

export interface ProfileResponse {
  status: string;
  message?: string;
  data: {
    nome: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserInformationHandleService {

  private apiUrl = environment.apiUrl;
  private profileEndpoint = '/auth/profile.php';

  constructor(private http: HttpClient, private authService: AccountAuthHandleService, private errorHandler: ErrorHandlerService, private authHeader: AuthHeaderService) { }

  getProfile(): Observable<ProfileResponse> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      ...this.authHeader.getAppSecret()
    });

    return this.http.get<ProfileResponse>(`${this.apiUrl}${this.profileEndpoint}`, { headers }).pipe(
      catchError(this.errorHandler.handleError)
    );
  }

}