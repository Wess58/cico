import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
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
export class NavbarComponent implements OnInit {

  isLoggedIn = false;

  constructor(
    private router: Router

  ) { }

  ngOnInit(): void {
    this.isLoggedIn = localStorage.getItem('tkn') ? true : false;
  }


  logOut(): void {
    localStorage.removeItem('tkn');
    this.router.navigate(['/admin/login']);
    setTimeout(() => {
      location.reload();
    }, 10);
  }

}
