import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Step01Page } from './step01.page';

const routes: Routes = [
  {
    path: '',
    component: Step01Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Step01PageRoutingModule {}
