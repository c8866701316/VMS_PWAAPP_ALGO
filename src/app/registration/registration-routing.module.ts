import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrationPage } from './registration.page';

const routes: Routes = [
  // {
  //   path: 'pre-registration',
  //   // component: RegistrationPage
  //   loadChildren: () => import('../pre-registration/pre-registration.module').then( m => m.PreRegistrationPageModule)
  // },
  // {
  //   path: 'pre-registration',
  //   loadChildren: () => import('./pre-registration/pre-registration.module').then( m => m.PreRegistrationPageModule)
  // },
  // {
  //   path: 'register-checkin',
  //   loadChildren: () => import('./register-checkin/register-checkin.module').then( m => m.RegisterCheckinPageModule)
  // }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationPageRoutingModule {}
