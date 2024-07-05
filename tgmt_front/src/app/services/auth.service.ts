import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = environment.api;
  token: string = '';
  userId: string = '';
  isAuth$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { }

  signup(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.http.post<{ status: number, message: string }>(`${this.api}/users/signup`, { email, password }).subscribe(
        (signupData: { status: number, message: string }) => {
          if (signupData.status === 201) {
            this.signin(email, password)
              .then(() => {
                resolve(true);
              })
              .catch((error) => {
                reject(error);
              });
          } else {
            reject(signupData.message);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  signin(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.http.post<{ token: string, userId: string }>(`${this.api}/users/login`, { email, password }).subscribe(
        (authData) => {
          this.token = authData.token;
          this.userId = authData.userId;
          this.isAuth$.next(true);
          resolve(authData);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  logout() {;
    this.isAuth$.next(false);
    this.userId = "";
    this.token = "";
  }
}
