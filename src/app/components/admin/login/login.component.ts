import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

import { ApiService } from "../../../services/api.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        // :enter is alias to 'void => *'
        style({ opacity: 0 }),
        animate(300, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class LoginComponent implements OnInit {

  form: any = {};
  showPassword = false;
  notFound = false;

  constructor(
    private apiService: ApiService,
    private router: Router

  ) { }

  ngOnInit(): void {
  }


  getCurrentUser(): void {

    this.apiService.getOneUser(this.form.idNumber).subscribe(
      (res: any) => {
        // console.log(res);
        if (res.body && res.body.role == 'ADMIN' && res.body.password === this.form.password) {
          localStorage.setItem('tkn', res.body.idNumber);
          this.router.navigate(['/admin/attendance']);

          setTimeout(() => {
            location.reload();
          }, 100);
        } else {
          this.notFound = true;
        }
      },
      (error: any) => {
        // console.log(error);
        this.notFound = true;
      }
    )
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

}
