import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthHeaderService } from '../../HeaderService/auth-header.service';

export interface CreateAccountData {
  name: string;
  email: string;
  password: string;
}

export interface CreateAccountResponse {
  status: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class CreateAccountHandleService {

  private apiUrl = environment.apiUrl;
  private registerEndpoint = '/register.php';

  constructor(private http: HttpClient, private authHeader: AuthHeaderService) { }

  createAccount(data: CreateAccountData): Observable<CreateAccountResponse> {
    return this.http.post<CreateAccountResponse>(`${this.apiUrl}${this.registerEndpoint}`, data, {
      headers: this.authHeader.getHeaders()
    }).pipe(
      catchError(err => {
        console.error('Erro ao criar conta: ', err);
        return throwError(() => err);
      })
    );
  }

}
