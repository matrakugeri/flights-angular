import { Component } from '@angular/core';

@Component({
  selector: 'loading-spinner',
  standalone: true,
  styles: [
    `
      @use 'variables' as *;
      .spinner-div {
        backdrop-filter: blur(5px);
        background-color: rgba(0, 0, 0, 0.1);
        position: absolute;
        top: 0;
        left: 0;
        z-index: 99;
        max-width: 100%;
        max-height: 100%;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: effect 0.4s ease-out;
      }
      .loader {
        width: 75px;
        height: 75px;
        border: 7px dotted $light-pink-color;
        border-bottom-color: transparent;
        border-radius: 50%;
        display: inline-block;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
      }

      @keyframes effect {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }

      @keyframes rotation {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `,
  ],
  template: `<div class="spinner-div"><span class="loader"></span></div>`,
})
export class SpinnerComponent {
  constructor() {}
}
