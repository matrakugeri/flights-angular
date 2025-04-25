import { Component, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { FlightsStore } from '../../../../../pages/flights/services/flights.store';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  animations: [
    trigger('expandCollapse', [
      state(
        'collapsed',
        style({
          transform: 'translateX(-100px)',
          opacity: 0,
          display: 'none',
        })
      ),
      state(
        'expanded',
        style({
          transform: 'translateX(0px)',
          opacity: 1,
          display: 'block',
        })
      ),
      transition('expanded <=> collapsed', [animate('150ms ease')]),
    ]),
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  isExpanded = input.required();

  onAnimate() {
    this.isExpanded() ? 'collapsed' : 'expanded';
  }
}
