import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckInOutPage } from './check-in-out.page';

const routes: Routes = [
  {
    path: '',
    component: CheckInOutPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckInOutPageRoutingModule {}
