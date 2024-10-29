import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NeedingEventComponent } from './needing-event/needing-event.component';
import {HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch} from "@angular/common/http";
import {NeedingEventService} from "./needing-event.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import {AuthInterceptor} from "./auth.interceptor";
import {NgOptimizedImage} from "@angular/common";
import {MatTooltip, MatTooltipModule} from '@angular/material/tooltip';
import { PublicNeedsComponent } from './public-needs/public-needs.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import {ChatComponent} from "./chat/chat.component";
import {WebsocketService} from "./services/websocket.service";
import {MatButton} from "@angular/material/button";
import {MatDialogActions, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import { NotifyDropoffComponent } from './notify-dropoff/notify-dropoff.component';
import { ItemsOutsideComponent } from './items-outside/items-outside.component';

@NgModule({
  declarations: [
    AppComponent,
    NeedingEventComponent,
    LayoutComponent,
    LoginComponent,
    PublicNeedsComponent,
    TermsAndConditionsComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ChatComponent,
    NotifyDropoffComponent,
    ItemsOutsideComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    MatTooltip,
    MatButton,
    MatDialogActions,
    MatDialogTitle,
    MatDialogContent
  ],
  providers: [NeedingEventService, WebsocketService,
    provideClientHydration(), { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true,  },provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
