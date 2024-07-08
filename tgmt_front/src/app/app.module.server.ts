import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    HttpClientModule,
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
