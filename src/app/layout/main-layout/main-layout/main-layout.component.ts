import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthStore } from '../../../core/auth.store';
import { inject } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  authStore = inject(AuthStore);
  router = inject(Router);

  onLogout() {
    this.authStore.setState({ token: null, user: null });
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
