import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http'; // Importation de withFetch
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './components/auth/signin/signin.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { GamecardComponent } from './components/gamecard/gamecard.component';
import { SingleGameComponent } from './components/gamecard/single-game/single-game.component';
import { HeaderComponent } from './components/partials/header/header.component';
import { FooterComponent } from './components/partials/footer/footer.component';
import { NotFoundComponent } from './components/partials/not-found/not-found.component';
import { HeaderPageComponent } from './components/partials/header-page/header-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CreateGameComponent } from './admin/create-game/create-game.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { UpdateGameComponent } from './components/update-game/update-game.component';
import { FavoritesComponent } from './components/dashboard/favorites/favorites.component';
import { QuillModule } from 'ngx-quill';
import { CreateTableComponent } from './components/create-table/create-table.component';
import { TableListComponent } from './components/table-list/table-list.component';
import { OpeningHoursComponent } from './components/opening-hours/opening-hours.component';
import { HomeComponent } from './components/home/home.component';
import { ContactComponent } from './components/contact/contact.component';
import { LegalNoticeComponent } from './components/legal-notice/legal-notice.component';
import { CookiePolicyComponent } from './components/cookie-policy/cookie-policy.component';


@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    GamecardComponent,
    SingleGameComponent,
    HeaderComponent,
    FooterComponent,
    NotFoundComponent,
    HeaderPageComponent,
    DashboardComponent,
    UserInfoComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    CreateGameComponent,
    UserManagementComponent,
    UpdateGameComponent,
    FavoritesComponent,
    CreateTableComponent,
    TableListComponent,
    OpeningHoursComponent,
    HomeComponent,
    ContactComponent,
    LegalNoticeComponent,
    CookiePolicyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, // Ajoutez l'intercepteur JWT aux providers
    provideHttpClient(withFetch()) // Ajoute withFetch pour utiliser l'API fetch avec SSR
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
