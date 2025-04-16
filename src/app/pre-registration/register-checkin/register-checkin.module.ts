import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterCheckinPageRoutingModule } from './register-checkin-routing.module';

import { RegisterCheckinPage } from './register-checkin.page';
import { NgStepperModule } from 'angular-ng-stepper';
import { CdkStepperModule } from '@angular/cdk/stepper';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CdkStepperModule,NgStepperModule,
    RegisterCheckinPageRoutingModule,
  ],
  declarations: [RegisterCheckinPage]
})
export class RegisterCheckinPageModule {}
