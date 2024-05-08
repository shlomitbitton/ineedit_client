import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NeedingEventComponent} from "./needing-event/needing-event.component";
import {LayoutComponent} from "./layout/layout.component";
import {LoginComponent} from "./login/login.component";
import {AuthGuard} from "./auth.guard";

const routes: Routes = [ {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'all-needs-by-user', component: NeedingEventComponent, canActivate: [AuthGuard] },
      { path: 'login', component: LoginComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirect default to login page
      { path: '**', redirectTo: 'login' } // Wildcard route to handle invalid URLs
    ]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
