import { Component, signal, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { containsValidChar } from '../../../../utils/validators';
import { AuthService } from '../../services/auth.service';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  isLoginMode = signal<boolean>(false);
  authService = inject(AuthService);

  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(7),
        containsValidChar,
      ],
    }),
  });

  get emailIsTrue() {
    return this.form.controls.email.touched && this.form.controls.email.invalid;
  }
  get passIsTrue() {
    return (
      this.form.controls.password.touched && this.form.controls.password.invalid
    );
  }

  onClick() {
    this.isLoginMode.set(!this.isLoginMode());
  }

  onSubmit() {
    if (this.isLoginMode()) {
      this.authService
        .login(this.form.value.email!, this.form.value.password!)
        .subscribe({
          next: (res) => {
            // navigate by url
            // isloading
            // snackbar
          },
          error: (error) => console.error(error),
        });
    }
    this.authService
      .register(this.form.value.email!, this.form.value.password!)
      .subscribe();

    this.form.reset();
  }
}
