import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Vérifier si localStorage est disponible
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');

      // Vérifier si un token est présent et ajouter l'en-tête d'autorisation si oui
      if (token) {
        const clonedReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
        return next.handle(clonedReq);
      }
    }

    // Si localStorage n'est pas disponible ou si aucun token n'est présent, passer la requête sans modification
    return next.handle(req);
  }
}
