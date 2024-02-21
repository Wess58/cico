import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

import { ApiService } from "../../services/api.service";

@Component({
  selector: 'app-cico',
  templateUrl: './cico.component.html',
  styleUrls: ['./cico.component.scss'],
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
export class CicoComponent implements OnInit {

  keys: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'empty', 0, 'delete'];
  idNumber: string = '';
  showLoader = false;
  notFound = false;
  user: any;
  successToCICO = false;
  failedToCICO = false;
  status = '';


  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    window.scroll(0, 0);
  }


  pickDigit(digit: string): void {
    this.notFound = false;
    this.failedToCICO = false;
    this.successToCICO = false;

    let idNumberArray = this.idNumber.split('');

    digit === 'delete' ? idNumberArray = idNumberArray.slice(0, -1) : idNumberArray.push(digit);

    this.idNumber = idNumberArray.join('');

    if (this.idNumber.length === 8) {
      this.showLoader = true;
      setTimeout(() => {
        this.getCurrentUser();
      }, 2000);
    }
  }

  getCurrentUser(): void {
    this.user = {};

    this.apiService.getOneUser(this.idNumber).subscribe(
      (res: any) => {
        // console.log(res);
        this.showLoader = false;
        if (res.body) {
          this.user = res.body ?? {};
          this.getCurrentUserAttendance();
        } else {
          this.notFound = true;
        }
      },
      (error: any) => {
        // console.log(error);
        this.showLoader = false;
        this.notFound = true;
      }
    )
  }

  getCurrentUserAttendance(): void {
    const options: any = {
      page: 0,
      size: 1,
      sort: 'id,desc',
      idNumber: this.idNumber,
    }

    this.apiService.filterAttendance(options).subscribe(
      (res: any) => {
        // console.log(res);
        this.status = res.body[0].status;
      }
    )
  }


  proceedToCICO(): void {
    this.successToCICO = false;
    this.failedToCICO = false;

    this.apiService.proceedToCICO({ idNumber: this.idNumber }).subscribe(
      (res: any) => {
        // console.log(res);
        this.successToCICO = true;
        this.status = res.status;

        setTimeout(() => {
          this.resetFields();
        }, 5000);
      },
      (error: any) => {
        this.failedToCICO = true;
      }
    )
  }

  resetFields(): void {
    this.notFound = false;
    this.failedToCICO = false;
    this.successToCICO = false;
    this.idNumber = '';
    this.user = {};
    this.status = '';
  }


}
