import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  email: string = '';
  message: string = '';
  isError: boolean = false;

  constructor(private router: Router, private authService: AuthService) {
  }

  onSubmit() {
    console.log("Password recovery process initiated");
    this.authService.getUserPassword(this.email).subscribe(result => {
      this.message = result.message;
      this.isError = result.isError;
    });
  }
}
