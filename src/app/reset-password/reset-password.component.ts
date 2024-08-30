import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../auth.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {

  newPassword: string = '';
  message: string = '';
  isError: boolean = false;
  token: string = '';

  constructor(private http: HttpClient, private route: ActivatedRoute, private authService: AuthService) {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  ngOnInit(): void {
    // Retrieve the token from the URL query parameters
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    console.log('Token:', this.token);
  }
  onSubmit() {
    console.log("Password change process initiated");
    this.authService.changeUserPassword(this.newPassword, this.token).subscribe(result => {
      this.message = result.message;
      this.isError = result.isError;
    });
  }


}
