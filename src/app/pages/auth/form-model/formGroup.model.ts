import { FormControl } from '@angular/forms';

export interface AuthFormFields {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  firstName?: FormControl<string | null>;
  lastName?: FormControl<string | null>;
}
