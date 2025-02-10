import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Adapte le chemin
import { Observable, of } from 'rxjs'; // Importe 'of'
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.getRole().pipe(
      map(role => {
        const expectedRole = next.data['expectedRole']; // Récupère le rôle attendu

        if (!role) {
          // Si l'utilisateur n'est pas connecté, redirige vers la page de connexion
          this.router.navigate(['/sign-in'], { queryParams: { returnUrl: state.url } });
          return false;
        }

        if (expectedRole && role !== expectedRole) {
          // Si un rôle est attendu et que l'utilisateur ne l'a pas, redirige
          // (tu peux personnaliser la redirection ici)
          this.router.navigate(['/']); // Redirige vers l'accueil, par exemple
          return false;
        }

        // Si l'utilisateur est connecté et a le rôle attendu (ou si aucun rôle n'est attendu), autorise l'accès
        return true;
      }),
      catchError(() => {
        // En cas d'erreur lors de la récupération du rôle (par exemple, token expiré)
        this.router.navigate(['/sign-in'], { queryParams: { returnUrl: state.url } });
        return of(false); // Bloque l'accès et force la déconnexion/redirection
      })
    );
  }
}
