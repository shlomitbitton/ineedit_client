import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NeedingEventComponent} from "./needing-event/needing-event.component";
import {LayoutComponent} from "./layout/layout.component";
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./auth.guard";
import {PublicNeedsComponent} from "./public-needs/public-needs.component";
import {TermsAndConditionsComponent} from "./terms-and-conditions/terms-and-conditions.component";
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";
import {ResetPasswordComponent} from "./reset-password/reset-password.component";
import {NotifyDropoffComponent} from "./notify-dropoff/notify-dropoff.component";
import {ItemsOutsideComponent} from "./items-outside/items-outside.component";

const routes: Routes = [ {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'all-needs-by-user', component: NeedingEventComponent, canActivate: [AuthGuard] },
      { path: 'login', component: LoginComponent },
      { path: 'public-needs', component: PublicNeedsComponent ,data: { showExploreLabel: false }},
      { path: 'notify-dropoff', component: NotifyDropoffComponent },
      { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'items-outside', component: ItemsOutsideComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirect default to public needs page
      { path: '**', redirectTo: 'public-needs' } // Wildcard route to handle invalid URLs
    ]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
