import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { RepeatPasswordErrorMatcher, repeatPasswordValidator } from 'src/app/shared/validators/repeat-password.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  public matcher = new RepeatPasswordErrorMatcher();
  public hide = true;
  public hideRepeat = true;
  public registerForm: FormGroup;
  public error = '';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['']
    }, {
      validators: repeatPasswordValidator
    });
  }

  get controls(): {[key: string]: AbstractControl} {
    return this.registerForm.controls;
  }

  handleSubmit(): void {
    if (this.registerForm.valid) {
      this.error = '';
      this.authService.register(this.controls.email.value, this.controls.password.value)
        .subscribe({
          next: () => {
            this.router.navigateByUrl('/dashboard');
          },
          error: (err) => {
            this.error = 'Email is occupied';
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
