import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Step01PageRoutingModule } from './step01-routing.module';

import { Step01Page } from './step01.page';
import { NgStepperModule } from 'angular-ng-stepper';
import { CdkStepperModule } from '@angular/cdk/stepper';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Step01PageRoutingModule,
    ReactiveFormsModule,
    CdkStepperModule,NgStepperModule,
  ],
  declarations: [Step01Page]
})
export class Step01PageModule {}
