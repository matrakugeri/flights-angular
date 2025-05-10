import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { RoleDirective } from '../../../../../shared/role.directive';
import { Role } from '../../../../../shared/enums';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RoleDirective],
  animations: [
    trigger('expandCollapse', [
      state(
        'collapsed',
        style({
          transform: 'translateX(-100px)',
          opacity: 0,
          visibility: 'hidden',
          width: '0px',
        })
      ),
      state(
        'expanded',
        style({
          transform: 'translateX(0px)',
          opacity: 1,
          visibility: 'visible',
          width: '*',
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
  Role = Role;

  onAnimate() {
    this.isExpanded() ? 'collapsed' : 'expanded';
  }
}
