import { Component, signal, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { containsValidChar } from '../../../../utils/validators';
import { AuthService } from '../../services/auth.service';
import { SpinnerComponent } from '../../../../shared/loading-spinner.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, SpinnerComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  isLoginMode = signal<boolean>(true);
  authService = inject(AuthService);
  isLoading = signal<boolean>(false);

  form = new FormGroup({
    email: new FormControl('myuser@gmail.com', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('myuser!', {
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
    this.isLoading.set(true);
    if (this.isLoginMode()) {
      this.authService
        .login(this.form.value.email!, this.form.value.password!)
        .subscribe({
          next: () => this.isLoading.set(false),
          error: () => this.isLoading.set(false),
        });
    } else {
      this.authService
        .register(this.form.value.email!, this.form.value.password!)
        .subscribe({
          next: () => this.isLoading.set(false),
          error: () => this.isLoading.set(false),
        });
    }

    this.form.reset();
  }
}
