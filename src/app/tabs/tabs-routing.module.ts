import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'gatekeeper',
    component: TabsPage,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardPageModule)
      },
      {
        path: 'pre-registration',
        loadChildren: () => import('../pre-registration/pre-registration.module').then(m => m.PreRegistrationPageModule)
      },
      {
        path: 'check-in-out',
        loadChildren: () => import('../check-in-out/check-in-out.module').then(m => m.CheckInOutPageModule)
      },
      {
        path: 'check-out',
        loadChildren: () => import('../check-out/check-out.module').then(m => m.CheckOutPageModule)
      },
      {
        path: 'qrcode',
        loadChildren: () => import('../qrcode/qrcode-routing.module').then(m => m.QrcodePageRoutingModule)
      },
      {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
