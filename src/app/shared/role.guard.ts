/*
Title: role.guard.ts
Author: Professor Krasso
Updated Date: 02/25/2023
Modified By: Andres Macias/Patrick Wolff/April Yang
Description: manage roles
*/


import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { RoleService } from './services/role.service';
import { Role } from './models/role.interface';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  role: Role;

  constructor(private router: Router, private cookieService: CookieService, private roleService: RoleService) {
    this.role = {} as Role;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.roleService.findUserRole(this.cookieService.get('sessionuser')).pipe(map(res => {
      this.role = res.data;

      console.log('User role: ' + this.role.text);
      console.log(this.role);

      if (res.data.text === 'admin') {
        return true;
      } else {
        this.router.navigate(['/']);
        return false;
      }
    }))
  }
}
