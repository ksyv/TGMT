import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './components/auth/signup/signup.component';
import { SigninComponent } from './components/auth/signin/signin.component';
import { GamecardComponent } from './components/gamecard/gamecard.component';
import { SingleGameComponent } from './components/gamecard/single-game/single-game.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthGuard } from './guards/auth.guard';
import { CreateGameComponent } from './admin/create-game/create-game.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { UpdateGameComponent } from './components/update-game/update-game.component';
import { AdminGuard } from './guards/admin.guard';
import { FavoritesComponent } from './components/dashboard/favorites/favorites.component';

const routes: Routes = [
  { path: 'sign-up', component: SignupComponent },
  { path: 'sign-in', component: SigninComponent },
  { path: 'gamecard', component: GamecardComponent },
  { path: 'single-game/:id', component: SingleGameComponent },
  { path: 'games/:id/update', component: UpdateGameComponent, canActivate: [AuthGuard, AdminGuard], data: { expectedRole: 'admin' }},
  { path: 'dashboard', component: DashboardComponent },
  { path: 'mes-informations', component: UserInfoComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: 'admin/dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'admin' },
    children: [
      {
        path: 'create-game',
        component: CreateGameComponent,
        canActivate: [AuthGuard],
        data: { expectedRole: 'admin' }
      },
      { path: 'user-management', component: UserManagementComponent, canActivate: [AuthGuard], data: { expectedRole: 'admin' } },
    ],
  },
  { path: 'dashboard/favorites', component: FavoritesComponent},
  // Redirection par défaut
  { path: '', redirectTo: '/gamecard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
