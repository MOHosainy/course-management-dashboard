
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ToastService } from '../../../core/services/toast.ts';
import { ToastService } from '../../../../core/services/toast';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (toastService.toast(); as t) {
      <div [class]="'toast-box ' + t.type">
        <span>{{ t.message }}</span>
        <button (click)="toastService.clear()">&times;</button>
      </div>
    }
  `,
  styles: [`
    .toast-box { position: fixed; top: 20px; right: 20px; padding: 15px 25px; border-radius: 8px; color: white; display: flex; justify-content: space-between; align-items: center; gap: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1100; font-family: sans-serif; animation: slideIn 0.3s ease; }
    .success { background-color: #2ec4b6; }
    .danger { background-color: #e71d36; }
    .info { background-color: #011627; }
    button { background: none; border: none; color: white; font-size: 20px; cursor: pointer; }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  `]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}