import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NeedingEventComponent } from './needing-event/needing-event.component';
import {HTTP_INTERCEPTORS, HttpClientModule, withFetch} from "@angular/common/http";
import {NeedingEventService} from "./needing-event.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import {AuthInterceptor} from "./auth.interceptor";
import {NgOptimizedImage} from "@angular/common";
import {MatTooltip, MatTooltipModule} from '@angular/material/tooltip';
import { PublicNeedsComponent } from './public-needs/public-needs.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';

@NgModule({
  declarations: [
    AppComponent,
    NeedingEventComponent,
    LayoutComponent,
    LoginComponent,
    PublicNeedsComponent,
    TermsAndConditionsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    MatTooltip
  ],
  providers: [NeedingEventService,
    provideClientHydration(), { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
