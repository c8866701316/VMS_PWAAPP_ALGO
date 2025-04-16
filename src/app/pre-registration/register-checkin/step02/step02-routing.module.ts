import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Step02Page } from './step02.page';

const routes: Routes = [
  {
    path: '',
    component: Step02Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Step02PageRoutingModule {}
