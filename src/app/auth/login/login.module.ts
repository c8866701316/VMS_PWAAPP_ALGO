import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { IonSpinner } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // IonSpinner,
    IonicModule.forRoot({mode: 'md' }),
    LoginPageRoutingModule
  ],
  declarations: [LoginPage],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginPageModule {}
