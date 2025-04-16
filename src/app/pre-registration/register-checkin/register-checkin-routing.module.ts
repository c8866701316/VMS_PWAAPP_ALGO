import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterCheckinPage } from './register-checkin.page';

const routes: Routes = [
  {
    path: '',
    // component: RegisterCheckinPage
    loadChildren: () => import('./step01/step01.module').then( m => m.Step01PageModule)
  },
  // {
  //   path: 'step01',
  //   loadChildren: () => import('./step01/step01.module').then( m => m.Step01PageModule)
  // },
  {
    path: '',
    loadChildren: () => import('./step02/step02.module').then( m => m.Step02PageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterCheckinPageRoutingModule {}
