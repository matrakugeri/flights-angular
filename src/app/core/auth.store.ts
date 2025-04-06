import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ServiceNameService {
  constructor() {}
  state$ = new BehaviorSubject(null);
}
