import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public hide = true;
  public loginForm: FormGroup;
  public error = '';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  get controls(): {[key: string]: AbstractControl} {
    return this.loginForm.controls;
  }

  handleSubmit(): void {
    if (this.loginForm.valid) {
      this.error = '';
      this.authService.login(this.controls.email.value, this.controls.password.value)
        .subscribe({
          next: () => {
            this.router.navigateByUrl('/dashboard');
          },
          error: (err) => {
            this.error = 'Email or password is incorrect';
            console.log(err);
          }
        });
    }
  }

  handleGoogleLogin(): void {
    this.error = '';
    this.authService.loginWithGoogle()
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/dashboard');
        },
        error: (err) => {
          this.error = 'Something went wrong, please retry';
          console.log(err);
        }
      });
  }
}
