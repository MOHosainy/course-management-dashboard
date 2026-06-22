// import { Component, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';

// @Component({
//   selector: 'app-root',
//   imports: [RouterOutlet],
//   templateUrl: './app.html',
//   styleUrl: './app.scss'
// })
// export class App {
//   protected readonly title = signal('course-management-dashboard');
// }
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  template: `
    <app-toast></app-toast>
    
    <main class="app-layout">
       <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .app-layout { background-color: #f4f6f8; min-height: 100vh; width: 100%; margin: 0; padding: 0; box-sizing: border-box;}
  `]
})
export class App {}