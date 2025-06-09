import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthHeaderService } from '../../HeaderService/auth-header.service';

@Injectable({
  providedIn: 'root'
})
export class AlertHistoryService {
  private apiUrl = environment.apiUrl;
  private listAlertsEndpoint = '/device/list-alerts.php';

  constructor(private http: HttpClient, private headerService: AuthHeaderService) { }

  getAlertHistory(id_usuario: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...this.headerService.getAppSecret()
    });

    const body = { id_usuario };

    return this.http.post(`${this.apiUrl}${this.listAlertsEndpoint}`, body, { headers });
  }
}