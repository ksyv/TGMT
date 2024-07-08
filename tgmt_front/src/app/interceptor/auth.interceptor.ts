import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token'); // Récupère le token JWT depuis le localStorage

    if (token) {
      console.log('Token JWT récupéré :', token); // Ajoute un message de débogage pour vérifier le token

      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    } else {
      console.log('Aucun token JWT trouvé dans le localStorage.');
    }

    console.log('Requête sortante avec en-tête Authorization :', request.headers.get('Authorization'));

    return next.handle(request);
  }
}
