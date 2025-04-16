import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreRegistrationPageRoutingModule } from './pre-registration-routing.module';

import { PreRegistrationPage } from './pre-registration.page';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PreRegistrationPageRoutingModule,
    NgSelectModule,
    MatInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
  ],
  declarations: [PreRegistrationPage]
})
export class PreRegistrationPageModule {}
