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
    email: new FormControl('admin@example.com', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('admin2!', {
      validators: [Validators.required],
    }),
  });

  onClick() {
    this.isLoginMode.set(!this.isLoginMode());
    console.log(this.form);
    if (!this.isLoginMode()) {
      this.form
        .get('password')
        ?.setValidators([
          Validators.required,
          Validators.minLength(7),
          containsValidChar,
        ]);
      this.form.get('password')?.updateValueAndValidity();
    } else {
      this.form.get('password')?.setValidators([Validators.required]);
      this.form.get('password')?.updateValueAndValidity();
    }
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
