import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';

import { ApiService } from "../../../services/api.service";
import exportFromJSON from 'export-from-json';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
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
export class AttendanceComponent implements OnInit {
  page: number = 1;
  attendanceList: Array<any> = [];
  loadAttendance = false;
  itemsPerPage = 50;
  totalItems = 0;
  filters: any = {
    // date: new Date().toISOString().slice(0, 10),
    status: ''
  }
  today = new Date().toISOString().slice(0, 10);


  constructor(
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.filters.idNumber = this.activatedRoute.snapshot.queryParams['idNumber'] ?? '';
    this.getAttendance();
  }

  getAttendance(page?: any, reload?: string): void {
    this.loadAttendance = true;
    this.page = page ? page : this.page ?? 1;

    const options: any = {
      page: this.page - 1,
      size: 50,
      sort: 'id,desc',
      idNumber: this.filters.idNumber ?? '',
      date: this.filters.date ?? '',
      status: this.filters.status ?? ''
    }

    this.apiService.filterAttendance(options).subscribe(
      (res: any) => {
        // console.log(res);
        page ? window.scroll(0, 0) : '';
        this.totalItems = Number(res.headers.get('X-Total-Count'));
        this.loadAttendance = false;
        this.attendanceList = res.body ?? [];

      },
      (error: any) => {
        // console.log(error);
        this.loadAttendance = false;
      }
    )
  }

  clearFilters(): void {
    this.filters = {
      status: ''
    };
    this.getAttendance();
  }


  exportToExcel(): void {
    const data: any = [];
    this.attendanceList.forEach((attendance: any) => {
      const excelObj = {
        name: attendance.user.name,
        id_number: attendance.user.name,
        phone_number: attendance.user.phoneNumber,
        email: attendance.user.email,
        role: attendance.user.role,
        gender: attendance.user.gender,
        status: attendance.status,
        check_in: attendance.checkInTime ?.substring(0, 5) ?? '-' ,
        check_out: attendance.checkOutTime ?.substring(0, 5) ?? '-',
        date: attendance.date
      }

      data.push(excelObj);
    });
    const fileName = this.today + '-attendance-report';
    const exportType = exportFromJSON.types.xls;

    exportFromJSON({ data, fileName, exportType });
  }


}
