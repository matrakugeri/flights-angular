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
import { AuthFormFields } from '../../form-model/formGroup.model';

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

  form = new FormGroup<AuthFormFields>({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      validators: [Validators.required],
    }),
  });

  // admin@example.com
  // admin2!

  onClick() {
    this.isLoginMode.set(!this.isLoginMode());
    console.log(this.form);
    if (!this.isLoginMode()) {
      this.form.addControl(
        'firstName',
        new FormControl('', {
          validators: [Validators.required, Validators.minLength(4)],
        })
      );
      this.form.addControl(
        'lastName',
        new FormControl('', {
          validators: [Validators.required, Validators.minLength(4)],
        })
      );
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
      this.form.removeControl('firstName');
      this.form.removeControl('lastName');
    }
  }

  onSubmit() {
    this.isLoading.set(true);
    if (this.isLoginMode()) {
      console.log(this.form.value);
      this.authService
        .login(this.form.value.email!, this.form.value.password!)
        .subscribe({
          next: () => this.isLoading.set(false),
          error: () => this.isLoading.set(false),
        });
    } else {
      console.log(this.form.value);
      const credentials = {
        email: this.form.value.email!,
        password: this.form.value.password!,
        firstName: this.form.value.firstName!,
        lastName: this.form.value.lastName!,
      };
      this.authService.register(credentials).subscribe({
        next: () => this.isLoading.set(false),
        error: () => this.isLoading.set(false),
      });
    }

    this.form.reset();
  }
}
