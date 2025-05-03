import { Component, output } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatFormField } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-users-form',
  standalone: true,
  imports: [
    MatFormField,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: './users-form.component.html',
  styleUrl: './users-form.component.scss',
})
export class UsersFormComponent {
  enteredValues = output<{
    firstName: string | null;
    lastName: string | null;
  }>();

  resettedValues = output<{
    start: number;
    firstName: string | null;
    lastName: string | null;
  }>();

  enteredFirstName = null;
  enteredLastName = null;

  onSubmit() {
    const User = {
      firstName: this.enteredFirstName || null,
      lastName: this.enteredLastName || null,
    };
    this.enteredValues.emit(User);
  }

  isEmptyForm() {
    return !!this.enteredFirstName || !!this.enteredLastName;
  }

  onReset() {
    this.enteredFirstName = null;
    this.enteredLastName = null;
    const params = {
      start: 0,
      firstName: null,
      lastName: null,
    };
    this.resettedValues.emit(params);
  }
}
