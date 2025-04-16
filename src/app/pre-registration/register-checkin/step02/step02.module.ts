import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Step02PageRoutingModule } from './step02-routing.module';

import { Step02Page } from './step02.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Step02PageRoutingModule
  ],
  declarations: [Step02Page]
})
export class Step02PageModule {}
