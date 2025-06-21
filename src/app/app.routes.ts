import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DonateMedicineComponent } from './components/medicines/donate-medicine/donate-medicine.component';
import { RequestMedicineComponent } from './components/medicines/request-medicine/request-medicine.component';
import { CommonModule } from '@angular/common';
import { InfoComponent } from './components/medicines/info/info.component';
/*import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';*/

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'medicine-info', component: InfoComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    //canActivate: [AuthGuard] 
  },
  { 
    path: 'donate-medicine', 
    component: DonateMedicineComponent, 
    //canActivate: [AuthGuard] 
  },
  { 
    path: 'request-medicine', 
    component: RequestMedicineComponent, 
    //canActivate: [AuthGuard] 
  },
  /*{ 
    path: 'profile', 
    component: ProfileComponent, 
    canActivate: [AuthGuard] 
  },*/
  { path: '**', redirectTo: '/login' }
];
