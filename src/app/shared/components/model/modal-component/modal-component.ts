// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-modal-component',
//   imports: [],
//   templateUrl: './modal-component.html',
//   styleUrl: './modal-component.scss',
// })
// export class ModalComponent {}
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div class="modal-backdrop">
        <div class="modal-content">
          <h3>{{ title }}</h3>
          <p>{{ message }}</p>
          <div class="modal-actions">
            <button class="btn btn-secondary" (click)="onCancel.emit()">Cancel</button>
            <button class="btn btn-danger" (click)="onConfirm.emit()">Confirm</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop { position: fixed; top:0; left:0; width:100vw; height:100vh; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
    .modal-content { background: white; padding: 25px; border-radius: 8px; width: 400px; text-align: center; box-shadow: 0 5px 15px rgba(0,0,0,0.3); font-family: sans-serif;}
    .modal-actions { display: flex; justify-content: center; gap: 15px; margin-top: 20px; }
    .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
    .btn-secondary { background: #e0e0e0; color: #333; }
    .btn-danger { background: #e71d36; color: white; }
  `]
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirmation';
  @Input() message = 'Are you sure you want to proceed?';
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
}