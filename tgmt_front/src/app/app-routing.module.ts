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

const routes: Routes = [
  {path: 'sign-up', component: SignupComponent},
  {path: 'sign-in', component: SigninComponent},
  {path: 'gamecard', component: GamecardComponent},
  {path: 'add-game', component: AddGameComponent},
  {path: 'edit-game', component: EditGameComponent},
  {path: 'single-game', component: SingleGameComponent},
  {path: 'dashboard', component: DashboardComponent },
  {path: 'mes-informations', component: UserInfoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
