/*
Title: security-question-list.component.ts
Author: Professor Krasso
Updated Date: 02/11/2023
Modified By: Andres Macias/Patrick Wolff/April Yang
Description: security question list component
*/

import { Component, OnInit } from '@angular/core';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { SecurityQuestionService } from 'src/app/shared/services/security-question.service';
import { SecurityQuestion } from 'src/app/shared/models/security-question.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-security-question-list',
  templateUrl: './security-question-list.component.html',
  styleUrls: ['./security-question-list.component.css'],
  providers: [ConfirmationService] // primeng
})
export class SecurityQuestionListComponent implements OnInit {
  securityQuestions: SecurityQuestion[];
  sqForm: FormGroup = this.fb.group({
    text:[null, Validators.compose([Validators.required])]
  });

  constructor(private securityQuestionService: SecurityQuestionService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder) {

    this.securityQuestions = [];
     // findAllSecurityQuestions from securityQuestionService
    this.securityQuestionService.findAllSecurityQuestions().subscribe({
      next: (res) => {
        this.securityQuestions = res.data;
      },
      error: (e) => {
        console.log(e);
      }
    })
    }

  ngOnInit(): void {
  }

  // function for createSecurityQuestion
  create(): void {
    const sqText = this.sqForm.controls['text'].value;

    const newSq = {
      text: sqText
    }

    this.securityQuestionService.createSecurityQuestion(newSq).subscribe({
      next: (res) => {
        this.securityQuestions.push(res.data);
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.sqForm.controls['text'].setErrors({'incorrect': false})
      }
    })
  }

  // function for deleteSecurityQuestion by id
  delete(sqId: string): void{
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this record?',
      header: 'Confirmation',
      icon: '<div style="background-color: #D3A625; color: black">pi pi-exclamation-triangle</div>',
      accept: () => {
        this.securityQuestionService.deleteSecurityQuestion(sqId).subscribe({
          next: (res) => {
            console.log('Security question deleted successfully!');
            this.securityQuestions = this.securityQuestions.filter(sq => sq._id !== sqId);
          },
          error: (e) => {
            console.log(e);
          }
        })
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            console.log('User rejected this operation');
            break;
          case ConfirmEventType.CANCEL:
            console.log('User canceled this operation');
            break;
        }
      }
   })
 }
}
