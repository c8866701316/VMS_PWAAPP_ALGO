import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/services/auth/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'gatekeeper/dashboard',
    canActivate: [AuthGuard],
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'gatekeeper/pre-registration',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pre-registration/pre-registration.module').then( m => m.PreRegistrationPageModule)
  },
  {
    path: 'gatekeeper/check-in-out',
    canActivate: [AuthGuard],
    loadChildren: () => import('./check-in-out/check-in-out.module').then( m => m.CheckInOutPageModule)
  },
  {
    path: 'gatekeeper/check-out',
    canActivate: [AuthGuard],
    loadChildren: () => import('./check-out/check-out.module').then( m => m.CheckOutPageModule)
  },
  {
    path: 'qrcode',
    canActivate: [AuthGuard],
    loadChildren: () => import('./qrcode/qrcode.module').then( m => m.QrcodePageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
