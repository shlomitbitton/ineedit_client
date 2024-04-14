import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NeedingEventComponent} from "./needing-event/needing-event.component";
import {LayoutComponent} from "./layout/layout.component";

const routes: Routes = [ {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'allNeedsByUser', component: NeedingEventComponent }
    ]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],//{ enableTracing: true }
  exports: [RouterModule]
})
export class AppRoutingModule { }
