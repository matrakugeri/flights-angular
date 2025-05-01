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

  onSubmit(form: NgForm) {
    this.enteredValues.emit(form.form.value);
  }
}
