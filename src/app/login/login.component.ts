import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from "../auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls:  ['./login.component.css']
})
export class LoginComponent {
  returnUrl: string = '';
  loginErrorMessage: string | null = null;
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService ) { }

  onSubmit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] ;

    const username = this.loginForm.get('username')?.value || '';
    const password = this.loginForm.get('password')?.value || '';

    if (!username || !password) {
      this.loginErrorMessage = 'Please fill in both username and password fields.';
      console.error('Missing username or password.');
      return;
    }
    this.login(username, password);
  }

  login(username: string, password: string) {
    this.authService.authenticateUser(username, password).subscribe({
      next: (response) => {
        if (response && !response.error) {
          this.router.navigate([this.returnUrl])
            .then(() => console.log("Navigation successful!"))
            .catch(err => console.error("Navigation error: ", err)) // Handling navigation errors
        } else {
          console.error('Login Error:', response.error || 'Unknown error occurred');
          this.loginErrorMessage = response.error || 'An unknown error occurred during login.';
        }
      },
        error:(error) => {
        console.error('Login error:', error);
        this.loginErrorMessage = 'Login failed. Please check your credentials.';
      },
        complete:() => console.log('Login request completed.')
    });
  }


}
