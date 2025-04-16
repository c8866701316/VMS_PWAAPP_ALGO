import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckInOutPageRoutingModule } from './check-in-out-routing.module';

import { CheckInOutPage } from './check-in-out.page';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckInOutPageRoutingModule
  ],
  declarations: [CheckInOutPage]
})
export class CheckInOutPageModule {}
