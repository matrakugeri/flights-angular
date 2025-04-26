import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthStore } from './core/auth.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  host: {
    class: 'full',
  },
})
export class AppComponent implements OnInit {
  authStore = inject(AuthStore);

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      const gotUser = JSON.parse(user);
      this.authStore.setState(gotUser);
    }
  }
}
