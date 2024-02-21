import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { trigger, transition, style, animate } from '@angular/animations';

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
    role: 'USER'
  };
  itemsPerPage: number = 10;
  page: number = 1;
  totalItems: number = 0;
  submitting = false;
  loadUsers = false;


  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    window.scroll(0, 0);
    // this.testUsers();
    this.getUsers();
  }

  getUsers(): void {
    this.loadUsers = true;
    this.users = [];

    this.apiService.getUsers().subscribe(
      (res: any) => {
        setTimeout(() => {
          this.loadUsers = false;
          this.users = res.body ?? [];
        }, 3000);
      }
    )
  }

  addUser(): void {
    this.submitting = true;

    this.user.password = this.user.role === 'ADMIN' ? this.user.idNumber + this.user.phoneNumber : null;
    this.apiService.createUser(this.user).subscribe(
      (res: any) => {
        this.user = {
          gender: 'MALE',
          role: 'USER'
        };
        this.submitting = false;

        this.getUsers();
      }
    )
  }

  editUser(): void {
    this.submitting = true;
    this.apiService.editUser(this.user).subscribe(
      (res: any) => {
        this.user = {
          gender: 'MALE',
          role: 'USER'
        };
        this.submitting = false;
        this.getUsers();
      }
    )
  }


  selectUser(user: any): void {
    this.user = Object.assign({}, user);
  }

  deleteUser(): void {
    this.apiService.deleteUser(this.user.idNumber).subscribe(
      (res: any) => {
        this.user = {
          gender: 'MALE',
          role: 'USER'
        };
        this.getUsers();
      }
    )
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
