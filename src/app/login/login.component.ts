import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from "../auth.service";
import {NeedingEventService} from "../needing-event.service";
import {ActivatedRoute, Router} from "@angular/router";
import {response} from "express";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  returnUrl: string = '';
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService ) { }

  onSubmit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'allNeedsByUser';

    const username = this.loginForm.get('username')?.value || '';
    const password = this.loginForm.get('password')?.value || '';

    if (!username || !password) {
      console.error('Username or password field is missing');
      return;
    }

    this.authService.authenticateUser(username, password)
      .subscribe({next: (response) => {
      console.info(`user login: `+ this.loginForm.value);
      },
      error: (error) => {
      console.error('Error on user login:', error);
      },
        complete: () => console.log('Login request complete')
    });
  }

  login(username: string, password: string) {
    this.authService.authenticateUser(username, password).subscribe(response => {
      if (response) {
        // Redirect to the desired return URL
        this.router.navigate([this.returnUrl]);
      }
    });
  }

}
