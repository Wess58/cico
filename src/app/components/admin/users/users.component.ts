import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';

import { ApiService } from "../../../services/api.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
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
export class UsersComponent implements OnInit {

  users: Array<any> = [];
  user: any = {
    gender: 'MALE',
    role: 'USER',
    department: 'ACCOUNTS'
  };
  itemsPerPage: number = 10;
  page: number = 1;
  totalItems: number = 0;
  submitting = false;
  loadUsers = false;
  emailInvalid = false;
  idInvalid = false;
  phoneInvalid = false;
  isLoggedInUser = false;


  constructor(
    private apiService: ApiService,
    private router: Router

  ) { }


  ngOnInit(): void {
    window.scroll(0, 0);
    if (!localStorage.getItem('tkn')) {
      // localStorage.setItem('url', this.router.url);
      this.router.navigate(['/admin/login']);
    } else {
      this.getUsers();
    }
    // this.testUsers();
  }

  getUsers(): void {
    this.loadUsers = true;
    this.users = [];

    this.apiService.getUsers().subscribe(
      (res: any) => {
        setTimeout(() => {
          this.loadUsers = false;
          this.users = res.body ?? [];
        }, 2500);
      }
    )
  }

  addUser(): void {
    this.submitting = true;

    this.user.password = this.user.role === 'ADMIN' ? this.user.idNumber + this.user.phoneNumber : null;
    this.user.name = this.user.firstName + " " + this.user.lastName;

    this.apiService.createUser(this.user).subscribe(
      (res: any) => {
        this.resetUser();
        this.submitting = false;

        this.getUsers();
      }
    )
  }

  editUser(): void {
    this.submitting = true;
    this.user.name = this.user.firstName + " " + this.user.lastName;

    this.apiService.editUser(this.user).subscribe(
      (res: any) => {
        this.resetUser();
        this.submitting = false;
        this.getUsers();
      }
    )
  }

  validateEmail(): void {
    if (this.user?.email?.length) {
      /\S+@\S+\.\S+/.test(this.user.email) ? (this.emailInvalid = false) : (this.emailInvalid = true);
    }
  }

  validateId(): void {
    this.idInvalid = this.user ?.idNumber ?.length < 8;
  }

  validatedPhoneNumber(): void {
    this.phoneInvalid = this.user ?.phoneNumber ?.length < 12;
  }


  selectUser(user: any): void {
    this.user = Object.assign({}, user);
    const names: any = this.user.name.split(' ');
    this.user.firstName = names[0];
    this.user.lastName = names[1];
    this.isLoggedInUser = localStorage.getItem('tkn') === this.user.idNumber;

  }

  deleteUser(): void {
    this.apiService.deleteUser(this.user.idNumber).subscribe(
      (res: any) => {
        this.resetUser();
        this.getUsers();
      }
    )
  }

  resetUser(): void {
    this.user = {
      gender: 'MALE',
      role: 'USER',
      department: 'ACCOUNTS'
    };
  }


  // testUsers(): void {
  //   const user = {
  //     name: 'Steph Njeri',
  //     idNumber: '38123456',
  //     phone: '0701883387',
  //     email: 'stephnjeri@gmail.com	',
  //     gender: 'FEMALE',
  //     role: 'ADMIN'
  //   }
  //   this.users = Array.from({ length: 10 }, () => (user))
  // }


  loadPage(page?: number): void {
    // make API call
    // res.headers
    // this.totalItems = Number(headers.get('X-Total-Count'));

  }


}
