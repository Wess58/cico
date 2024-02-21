import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CicoComponent } from "./components/cico/cico.component";
import { LoginComponent } from "./components/admin/login/login.component";
import { UsersComponent } from "./components/admin/users/users.component";
import { AttendanceComponent } from "./components/admin/attendance/attendance.component";

const routes: Routes = [
  {
    path: '',
    component: CicoComponent
  },
  {
    path: 'home',
    component: CicoComponent
  },
  {
    path: 'admin/users',
    component: UsersComponent
  },
  {
    path: 'admin/attendance',
    component: AttendanceComponent
  },
  {
    path: 'admin/login',
    component: LoginComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // useHash: false,
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
