import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreRegistrationPage } from './pre-registration.page';

const routes: Routes = [
  {
    path: '',
    component: PreRegistrationPage
  },
  {
    path: 'register-checkin',
    loadChildren: () => import('./register-checkin/register-checkin.module').then( m => m.RegisterCheckinPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreRegistrationPageRoutingModule {}
