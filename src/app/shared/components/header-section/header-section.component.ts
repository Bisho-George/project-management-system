import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-header-section',
  templateUrl: './header-section.component.html',
  styleUrls: ['./header-section.component.scss']
})
export class HeaderSectionComponent {
  @Input() title = '';
  @Input() buttonName = '';
  @Output() buttonClick = new EventEmitter<void>();

  openDialog() {
    this.buttonClick.emit();
  }
}
