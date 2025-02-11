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
import { CreateTableComponent } from './components/create-table/create-table.component';
import { TableListComponent } from './components/table-list/table-list.component';
import { OpeningHoursComponent } from './components/opening-hours/opening-hours.component';
import { HomeComponent } from './components/home/home.component';
import { ContactComponent } from './components/contact/contact.component';
import { LegalNoticeComponent } from './components/legal-notice/legal-notice.component';
import { CookiePolicyComponent } from './components/cookie-policy/cookie-policy.component';


const routes: Routes = [
  { path: 'sign-up', component: SignupComponent },
  { path: 'sign-in', component: SigninComponent },
  { path: 'home', component: HomeComponent },        // AJOUTE
  { path: 'contact', component: ContactComponent },
  { path: 'gamecard', component: GamecardComponent },
  { path: 'single-game/:id', component: SingleGameComponent },
  { path: 'games/:id/update', component: UpdateGameComponent, canActivate: [AuthGuard, AdminGuard], data: { expectedRole: 'admin' }},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] }, // Ajout du AuthGuard ici
  { path: 'mes-informations', component: UserInfoComponent, canActivate: [AuthGuard] }, // Ajout du AuthGuard ici
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'create-table/:gameId', component: CreateTableComponent, canActivate: [AuthGuard] }, // Ajout de la route, avec AuthGuard
  { path: 'tables', component: TableListComponent },
  { path: 'mentions-legales', component: LegalNoticeComponent },
  { path: 'politique-cookies', component: CookiePolicyComponent },
  {
    path: 'admin/dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard, AdminGuard], // Ajout du AdminGuard
    data: { expectedRole: 'admin' }, // Plus besoin de data, on a AdminGuard
    // children: [ // Les routes enfants sont plus nécessaires
    //   {
    //     path: 'create-game',
    //     component: CreateGameComponent,
    //     canActivate: [AuthGuard],
    //     data: { expectedRole: 'admin' }
    //   },
    //   { path: 'user-management', component: UserManagementComponent, canActivate: [AuthGuard], data: { expectedRole: 'admin' } },
    // ],
  },
    { path: 'create-game', component: CreateGameComponent, canActivate: [AdminGuard]},
    { path: 'user-management', component: UserManagementComponent, canActivate: [AdminGuard]},
  { path: 'dashboard/favorites', component: FavoritesComponent, canActivate: [AuthGuard]}, // Ajout de AuthGuard

  // Redirection par défaut
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'admin/opening-hours', component: OpeningHoursComponent, canActivate: [AdminGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
