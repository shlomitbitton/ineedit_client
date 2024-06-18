import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NeedingEventComponent} from "./needing-event/needing-event.component";
import {LayoutComponent} from "./layout/layout.component";
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./auth.guard";
import {PublicNeedsComponent} from "./public-needs/public-needs.component";
import {TermsAndConditionsComponent} from "./terms-and-conditions/terms-and-conditions.component";

const routes: Routes = [ {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'all-needs-by-user', component: NeedingEventComponent, canActivate: [AuthGuard] },
      { path: 'login', component: LoginComponent },
      { path: 'public-needs', component: PublicNeedsComponent ,data: { showExploreLabel: false }},
      { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirect default to public needs page
      { path: '**', redirectTo: 'public-needs' } // Wildcard route to handle invalid URLs
    ]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
