import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CicoComponent } from './components/cico/cico.component';
import { UsersComponent } from './components/admin/users/users.component';
import { LoginComponent } from './components/admin/login/login.component';
import { AttendanceComponent } from './components/admin/attendance/attendance.component';

import {NgxPaginationModule} from 'ngx-pagination';
import { NgmodelDebounceDirective } from './directives/ngmodel-debounce.directive';
import { ShortTimePipe } from './pipes/short-time.pipe';
import { MaskNumberPipe } from './pipes/mask-number.pipe';

@NgModule({
  declarations: [
    AppComponent,
    CicoComponent,
    UsersComponent,
    LoginComponent,
    AttendanceComponent,
    NgmodelDebounceDirective,
    ShortTimePipe,
    MaskNumberPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxPaginationModule
  ],
  providers: [
    // { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    { provide: LocationStrategy, useClass: PathLocationStrategy }

  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
