import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import {CdkStepperModule} from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';

import { RegistrationPageRoutingModule } from './registration-routing.module';

import { RegistrationPage } from './registration.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CdkStepperModule,NgStepperModule,
    RegistrationPageRoutingModule,
  ],
  declarations: [RegistrationPage]
})
export class RegistrationPageModule {}
