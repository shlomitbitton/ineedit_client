import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {AuthService} from "../auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserRegistrationService} from "../services/user-registration.service";
import {NeedingEventService} from "../needing-event.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls:  ['./login.component.css']
})
export class LoginComponent {

  returnUrl: string = '';
  userId!: string;
  loginErrorMessage: string | null = null;
  registrationErrorMessage: string | null = null;
  showRegisterForm = false;
  showRegistrationSuccessfulMessage = false;
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  registerForm: FormGroup;
  usernameExistsError= false;
  // usernameIsInvalidError= false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private authService: AuthService,
              private userRegistration: UserRegistrationService) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.email, this.customEmailValidator()]],
      password: ['', Validators.required]
    });
  }



  onSubmit() {
    this.loginErrorMessage = '';
    this.registrationErrorMessage = '';
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];

    const username = this.loginForm.get('username')?.value || '';
    const password = this.loginForm.get('password')?.value || '';

    if (!username || !password) {
      this.loginErrorMessage = 'Please fill in both username and password fields.';
      return;
    }
    this.login(username, password);
    console.log('Login form submitted');
  }

  toggleRegisterForm() {
    this.showRegisterForm = !this.showRegisterForm;
  }

  toggleRegistrationSuccessfulMessage() {
    this.showRegistrationSuccessfulMessage = !this.showRegistrationSuccessfulMessage;
  }

  login(username: string, password: string) {
    this.authService.authenticateUser(username, password).subscribe({
      next: (response) => {
        if (response && !response.error) {
          this.router.navigate([this.returnUrl])
            .then(() => console.log("Navigation successful!"))
            .catch(err => console.error("Navigation error: ", err)) // Handling navigation errors
          sessionStorage.setItem('userId', response.userId);
          console.log('User logged in successfully and userId saved in session storage');
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
      const newUser = this.registerForm.value;
      this.userRegistration.register(newUser).subscribe({
        next: (response) => {
          console.info("response " + response);
          if (response && response.status === 'success') {
            // this.registerForm =  new FormGroup({});
            this.showRegisterForm = false;
            this.usernameExistsError = false;
            this.registrationErrorMessage = '';
            this.showRegistrationSuccessfulMessage = true;
          } else {
            console.error('Registration Error:', response.message);
            this.registrationErrorMessage = response.message;
            if (response.message === "Username already exists.") {
              // this.usernameIsInvalidError = false;
              this.usernameExistsError = true;
              this.registrationErrorMessage = "Email address already exists.";
            }
            // if (response.message === "Username is invalid.") {//"Username should contain no spaces and be between 5 and 20 characters long..
            //   this.usernameExistsError = false;
            //   this.usernameIsInvalidError = true;
            // }
          }
        },
        error: (error) => {
          console.error('Registration error:', error);
          this.registrationErrorMessage = 'Registration failed.';
        },
        complete: () => console.log('Registration completed.')
      });
    }else{
      console.log("Form is invalid. Checking control errors: ");
      Object.keys(this.registerForm.controls).forEach((controlName) => {
          const control = this.registerForm.get(controlName);
          console.log(`Control ${controlName}:`, control?.errors);
          if (controlName === 'username' && control?.errors) {
            if (control.errors['email']) {
              this.registrationErrorMessage = 'Email address is invalid';
            }
          }
      }
      );
    }
  }

  customEmailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const valid = emailRegex.test(control.value);
      return valid ? null : { customEmail: true };
    };
  }

}
