import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NeedingEventComponent } from './needing-event/needing-event.component';
import {HttpClientModule,withFetch} from "@angular/common/http";
import {NeedingEventService} from "./needing-event.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    NeedingEventComponent,
    LayoutComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [NeedingEventService,
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
