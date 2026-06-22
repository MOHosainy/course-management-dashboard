

import { Injectable, signal } from '@angular/core';

export interface Toast {
  message: string;
  type: 'success' | 'danger' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toast = signal<Toast | null>(null);

  show(message: string, type: 'success' | 'danger' | 'info' = 'success') {
    this.toast.set({ message, type });
    setTimeout(() => this.clear(), 3000);
  }

  clear() {
    this.toast.set(null);
  }
}