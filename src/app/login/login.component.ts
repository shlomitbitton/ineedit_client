import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from "../auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {NewUser} from "./new-user";
import {UserRegistrationService} from "../services/user-registration.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls:  ['./login.component.css']
})
export class LoginComponent {

  returnUrl: string = '';
  loginErrorMessage: string | null = null;
  showRegisterForm = false;
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private authService: AuthService, private userRegistration: UserRegistrationService) {
    this.registerForm = this.fb.group({
      userFirstName: ['', Validators.required],
      userLastName: ['', Validators.required],
      userEmail: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }


  onSubmit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];

    const username = this.loginForm.get('username')?.value || '';
    const password = this.loginForm.get('password')?.value || '';

    if (!username || !password) {
      this.loginErrorMessage = 'Please fill in both username and password fields.';
      console.error('Missing username or password.');
      return;
    }
    this.login(username, password);
    console.log('Login form submitted');
  }

  toggleRegisterForm() {
    this.showRegisterForm = !this.showRegisterForm;
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
      error: (error) => {
        console.error('Login error:', error);
        this.loginErrorMessage = 'Login failed. Please check your credentials.';
      },
      complete: () => console.log('Login request completed.')
    });
  }

  register() {
    if (this.registerForm.valid) {
      // Extract form values and create an object
      const newUser = this.registerForm.value;
      this.userRegistration.register(newUser);
      console.log('Register form submitted');
    }
  }

}
