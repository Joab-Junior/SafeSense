import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountAuthHandleService } from '../AccounAuth/account-auth-handle.service';
import { AuthHeaderService } from '../../HeaderService/auth-header.service';

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

interface ApiResponse {
  status: 'success' | 'error';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordHandlerService {
  private apiUrl = environment.apiUrl
  private changePasswordEndpoint = '/auth/change-password.php'

  constructor(private http: HttpClient, private authService: AccountAuthHandleService, private headerService: AuthHeaderService) { }

  changePassword(currentPassword: string, newPassword: string): Observable<ApiResponse> {
    const body: ChangePasswordRequest = {
      currentPassword,
      newPassword
    };

    return this.http.post<ApiResponse>(
      this.apiUrl + this.changePasswordEndpoint,
      body,
      {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.authService.getToken() || ''}`,
          ...this.headerService.getAppSecret()
        })
      }
    );

  }
}
