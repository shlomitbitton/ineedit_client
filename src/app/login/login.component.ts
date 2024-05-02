import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from "../auth.service";
import {NeedingEventService} from "../needing-event.service";
import {ActivatedRoute} from "@angular/router";
import {response} from "express";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private authService: AuthService ) { }

  onSubmit() {
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

}
