import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const expectedRole = route.data['expectedRole'];

    return this.authService.getRole().pipe(
      take(1),
      map(role => {
        if (role === expectedRole) {
          return true; // L'utilisateur a le rôle attendu
        } else {
          // Redirection vers le dashboard approprié en fonction du rôle
          if (role === 'admin') {
            this.router.navigateByUrl('/admin/dashboard');
          } else {
            this.router.navigateByUrl('/dashboard');
          }
          return false;
        }
      })
    );
  }
}
