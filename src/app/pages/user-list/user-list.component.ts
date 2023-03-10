/*
Title: user-list.component.ts
Author: Professor Krasso
Updated Date: 02/21/2023
Modified By: Andres Macias/Patrick Wolff/April Yang
Description: User list component
*/

import { Component, OnInit } from '@angular/core';
import { User } from '../../shared/models/user.interface';
import { UserService } from '../../shared/services/user.service';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  providers: [ConfirmationService]
})
export class UserListComponent implements OnInit {

  users: User[] = [];

  constructor(private userService: UserService, private confirmationService: ConfirmationService) {
    this.userService.findAllUsers().subscribe({
      next: (res) => {
        this.users = res.data;
      },
      error: (e) => {
        console.log(e)
      }
    })
   }

  ngOnInit(): void {
  }

  // delete user by id
  delete(userId: string) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this user record?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',

      accept: () => {
        this.userService.deleteUser(userId).subscribe({
          next: (res) => {
            console.log('User deleted successfully');
            this.users = this.users.filter(user => user._id !== userId);
          },
          error: (e) => {
            console.log(e);
          }
        })
      },
      reject: (type: any) => {
        switch(type) {
          case ConfirmEventType.REJECT:
            console.log('User rejected this operation');
            break;
          case ConfirmEventType.CANCEL:
            console.log('User canceled this operation');
            break;
        }
      }
    });
  }
}
