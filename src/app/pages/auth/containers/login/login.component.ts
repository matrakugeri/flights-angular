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

  onClick() {
    this.isLoginMode.set(!this.isLoginMode());
  }

  onSubmit() {
    if (this.isLoginMode()) {
      this.authService
        .login(this.form.value.email!, this.form.value.password!)
        .subscribe();
    } else {
      this.authService
        .register(this.form.value.email!, this.form.value.password!)
        .subscribe();
    }

    this.form.reset();
  }
}
