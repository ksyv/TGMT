import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './components/auth/signup/signup.component';
import { SigninComponent } from './components/auth/signin/signin.component';
import { GamecardComponent } from './components/gamecard/gamecard.component';
import { AddGameComponent } from './components/gamecard/add-game/add-game.component';
import { EditGameComponent } from './components/gamecard/edit-game/edit-game.component';
import { SingleGameComponent } from './components/gamecard/single-game/single-game.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthGuard } from './guards/auth.guard';
import { CreateGameComponent } from './admin/create-game/create-game.component';

const routes: Routes = [
  { path: 'sign-up', component: SignupComponent },
  { path: 'sign-in', component: SigninComponent },
  { path: 'gamecard', component: GamecardComponent },
  { path: 'add-game', component: AddGameComponent },
  { path: 'edit-game', component: EditGameComponent },
  { path: 'single-game/:id', component: SingleGameComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'mes-informations', component: UserInfoComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
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
    ],
  },
  // Redirection par défaut
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
