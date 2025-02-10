import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpeningHoursService {
  private apiUrl = 'http://localhost:3000/api/opening-hours'; // URL de base

  constructor(private http: HttpClient) { }

  getOpeningHours(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  updateOpeningHours(hours: any): Observable<any> {
    return this.http.put<any>(this.apiUrl, hours, this.getHttpOptions()); // Envoie le token
  }
    private getHttpOptions() {
        const token = (typeof localStorage !== 'undefined') ? localStorage.getItem('access_token') : '';
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        });
        return { headers };
    }
}
