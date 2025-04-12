import { Component, inject, signal, output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '../../../../../core/auth.store';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor() {}
  sideBarOpen = output();

  authStore = inject(AuthStore);
  router = inject(Router);

  onLogout() {
    this.authStore.setState({ token: null, user: null });
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  onClick(): void {
    this.sideBarOpen.emit();
  }
}
