/*
Title: base-layout.component.ts
Author: Professor Krasso
Date: 02/09/2023
Modified By: Andres Macias/Patrick Wolff/April Yang
Description: application layout component
*/


import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.css']
})
export class BaseLayoutComponent implements OnInit {





  year: number = Date.now();

  sessionUserName: string;

  constructor(private cookieService: CookieService, private router: Router) {
     // from login component
    this.sessionUserName = this.cookieService.get('session_user');


    this.year = Date.now();
  }

  ngOnInit(): void {
  }

    // logout function deletes all cookies and navigate user to the home page by reloading the window
  logout() {
    this.cookieService.deleteAll();
    this.router.navigate(['/']).then(() => { window.location.reload(); });
  }

  profile() {
    const userName = this.cookieService.get('session_user')
    this.router.navigate(['/users/' + userName])
  }

}
