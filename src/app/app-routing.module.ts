import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseLayoutComponent } from "./shared/base-layout/base-layout.component";
// import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./pages/login/login.component";
import { AuthGuard } from './auth.guard';
import { AuthLayoutComponent } from './shared/auth-layout/auth-layout.component';
import { SecurityQuestionListComponent } from './pages/security-question-list/security-question-list.component';
import { SecurityQuestionDetailsComponent } from './pages/security-question-details/security-question-details.component';
import { ServiceRepairComponent } from './pages/service-repair/service-repair.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
<<<<<<< HEAD
import { VerifySecurityQuestionsFormComponent } from './shared/forms/verify-security-questions-form/verify-security-questions-form.component';
=======
import { NotFoundComponent } from './pages/not-found/not-found.component';
>>>>>>> 8c4093b2a760c221e31967c24fd26aacc6bcf687

const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
    {
        path: '',
        component: HomeComponent
      },
    {
        path: 'service-repair',
        component: ServiceRepairComponent
      },
      // {
      //   path: 'contact-us',
      //   component: ContactUsComponent
      // },
      // {
      //   path: 'about',
      //   component: AboutComponent
      // },
      {
      path: 'security-questions',
        component: SecurityQuestionListComponent,
      canActivate: [AuthGuard] // for logged in user
      },
      {
      path: 'security-questions/:questionId',
      component: SecurityQuestionDetailsComponent,
      canActivate: [AuthGuard]  // for logged in user
      },
    ],
  },
  {
    path: 'session',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
   {
    path: 'verify-security-questions',
    component: VerifySecurityQuestionsFormComponent,
  },
  //  {
  //       path: 'reset-password',
  //       component: ResetPasswordFormComponent,
  //     },
  // {
  //   path: 'not-found',
  //   component: NotFoundComponent
  // }
  ]
},
{
  path: '**',
  redirectTo: 'session/not-found'
}

];

@NgModule({
  /**
   * Description: UseHash: true, enableTracing: false, scrollPositionRestoration: 'enabled', relativeLinkResolution: 'legacy'
   * UseHash: true - This is used to enable the hash location strategy.
   * enableTracing: false - This is used to enable the router events.
   * scrollPositionRestoration: 'enabled' - This is used to enable the scroll position restoration.
  * relativeLinkResolution: 'legacy' - This is used to enable the legacy relative link resolution. Because of this, the router will use the first route that matches the URL.
   */
  imports: [RouterModule.forRoot(routes, { useHash: true, enableTracing: false, scrollPositionRestoration: 'enabled', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
