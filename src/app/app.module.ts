
import { APP_INITIALIZER, NgModule, CUSTOM_ELEMENTS_SCHEMA, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http'; 

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpInterceptor } from './http.interceptor';
import { AuthService } from './auth/services/auth/auth.service';
import { appInitializer } from './auth/helper/app.initializer';
import { ToastrModule } from 'ngx-toastr';
import { ServiceWorkerModule } from '@angular/service-worker';

const APP_INIT = {
  provide: APP_INITIALIZER,
  useFactory: appInitializer,
  multi: true,
  deps: [AuthService]
}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, BrowserAnimationsModule, HttpClientModule,ToastrModule.forRoot(), ServiceWorkerModule.register('./ngsw-worker.js', {
  enabled: !isDevMode(),
  // Register the ServiceWorker as soon as the application is stable
  // or after 30 seconds (whichever comes first).
  registrationStrategy: 'registerWhenStable:30000'
})],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptor, multi: true},
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
    ,HttpClient,
    APP_INIT
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
