import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';

import { ApiService } from "../../../services/api.service";
import exportFromJSON from 'export-from-json';
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable'



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
    status: '',
    startDate: '2024-05-10'
  }
  today = new Date().toISOString().slice(0, 10);
  timeNow = '';
  hideColumns = false;
  users: any = [];



  constructor(
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    if (!localStorage.getItem('tkn')) {
      // localStorage.setItem('url', this.router.url);
      this.router.navigate(['/admin/login']);
    } else {
      this.filters.idNumber = this.activatedRoute.snapshot.queryParams['idNumber'] ?? '';
      this.filters.endDate = this.today;
      this.getUsers();
    }
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
      status: this.filters.status ?? '',
      startDate: this.filters.startDate,
      endDate: this.filters.endDate
    }

    this.apiService.filterAttendance(options).subscribe(
      (res: any) => {
        // console.log(res);
        page ? window.scroll(0, 0) : '';
        this.totalItems = Number(res.headers.get('X-Total-Count'));
        this.loadAttendance = false;
        this.attendanceList = res.body.filter((obj: any) => { return obj ?.name }) ?? [];
        this.attendanceList.forEach((attendance: any) => {
          const userObj = this.users.find((user: any) => user.idNumber === attendance.idNumber);

          attendance.attendances[0].checkOutTime = attendance?.attendances[0]?.checkOutTime?.substring(0, 5) ?? '';
          attendance.attendances[0].checkInTime = attendance.attendances[0].checkInTime.substring(0, 5) ?? '';

          const isOutPastFive = +(attendance.attendances[0].checkOutTime.substring(0, 2)) > 17;
          const isOutBeforeFive = +(attendance.attendances[0].checkOutTime.substring(0, 2)) < 17;

          const isInBeforeFive = +(attendance.attendances[0].checkInTime.substring(0, 2)) < 17;
          const isInAfterFive = +(attendance.attendances[0].checkInTime.substring(0, 2)) > 17;
          const isStillAtWork = !attendance.attendances[0].checkOutTime;
          const nowIsNotPastFive = +(this.timeNow.substring(0, 2)) < 17;


          // CAME IN DURING REGULAR WORKING HOURS BUT ALSO LEFT BEFORE FIVE -> WILL GET REGULAR HOURS
          if (isInBeforeFive && isOutBeforeFive) {
            const workingHoursMilliseconds = (new Date(attendance.date + "T" + (isOutBeforeFive && attendance.attendances[0] ?.checkOutTime ? attendance.attendances[0] ?.checkOutTime : isStillAtWork && nowIsNotPastFive ? this.timeNow : '17:00')).getTime()) - (new Date(attendance.date + "T" + attendance.attendances[0].checkInTime)).getTime();
            const workingHoursArray = (workingHoursMilliseconds / (1000 * 60 * 60)).toFixed(2).split('.');
            const workingMinutesAray = (workingHoursMilliseconds / (1000 * 60)).toFixed(2).split('.');
            attendance.workHours = (+workingMinutesAray[0] > 60 ? (workingHoursArray[0] + "h, " + String(+('0.' + workingHoursArray[1]) * 60) + ' mins') : (+workingMinutesAray[0] > 0 ? workingMinutesAray[0] : '1') + " mins");
            attendance.overtime = '0 hours';
          }

          // CAME IN DURING REGULAR WORKING HOURS AND ALSO LEFT AFTER FIVE -> SHOULD BE GIVEN OVERTIME HOURS
          if (!isInAfterFive && isOutPastFive) {
            const overtimeMilliseconds = new Date(attendance.date + "T" + ( isStillAtWork && !nowIsNotPastFive ? this.timeNow : attendance.attendances[0] ?.checkOutTime)).getTime() - new Date(attendance.date + "T17:00").getTime();
            const overtimeHoursArray = (overtimeMilliseconds / (1000 * 60 * 60)).toFixed(2).split('.');
            const overtimeMinutesArray = (overtimeMilliseconds / (1000 * 60)).toFixed(2).split('.');
            attendance.overtime = (+overtimeMinutesArray[0] > 60 ? (overtimeHoursArray[0] + "h, " + String(+('0.' + overtimeHoursArray[1]) * 60) + ' mins') : (+overtimeMinutesArray[0] > 0 ? overtimeMinutesArray[0] : '1') + " mins");
          }

          // DID NOT COME IN DURING REGULAR WORKING HOURS -> DOES NOT GET REGULAR WORKING HOURS
          if (isInAfterFive) {
            const overtimeMilliseconds = new Date(attendance.date + "T" + (attendance.attendances[0] ?.checkOutTime)).getTime() - new Date(attendance.date + "T" + attendance.attendances[0].checkInTime).getTime();
            const overtimeHoursArray = (overtimeMilliseconds / (1000 * 60 * 60)).toFixed(2).split('.');
            const overtimeMinutesArray = (overtimeMilliseconds / (1000 * 60)).toFixed(2).split('.');
            attendance.overtime = (+overtimeMinutesArray[0] > 60 ? (overtimeHoursArray[0] + "h, " + String(+('0.' + overtimeHoursArray[1]) * 60) + ' mins') : overtimeMinutesArray[0] + " mins");
            attendance.workHours = '0 hours';
          }

          attendance.user = { ...attendance, ...userObj };
        });



        setTimeout(() => {
          this.attendanceList.sort((a: any, b: any) => b.date.localeCompare(a.date));
        }, 100);

      },
      (error: any) => {
        // console.log(error);
        this.loadAttendance = false;
      }
    )
  }

  getUsers(): void {
    this.loadAttendance = true;
    this.apiService.getUsers().subscribe(
      (res: any) => {
        // console.log(res);
        this.users = res.body ?? [];
        this.getAttendance();
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

  exportToPDF(): void {

    this.hideColumns = true;

    setTimeout(() => {
      let doc: any = new jsPDF();

      const img: any = new Image();
      img.src = 'assets/images/logo-wordmark.png';
      doc.addImage(img, 'png', 14, 2, 30, 10)
      doc.setFontSize(14);
      doc.text(14, 20, 'NON-CONTRACTORS ATTENDANCE REPORT');

      autoTable(
        doc,
        {
          startY: 25,
          html: '#content',
          headStyles: { fillColor: [2, 8, 110] },
          theme: 'grid'
        });


      doc.save(this.today + '-attendance-report');

      doc = new jsPDF();
      this.hideColumns = false;


    }, 10);



  }


}
