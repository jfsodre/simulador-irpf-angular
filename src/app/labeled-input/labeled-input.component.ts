import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-labeled-input',
  templateUrl: './labeled-input.component.html',
  styleUrls: ['./labeled-input.component.css']
})
export class LabeledInputComponent {
  @Input() label: string;
  @Input() currency = true;
  @Input() disabled = true;
  @Input() value: number;
  @Input() customId: string;

  @Output() inputValueChanged = new EventEmitter();

  constructor() {}

  changeInputValue(newValue) {
    if (!!this.inputValueChanged) {
      this.inputValueChanged.emit(newValue);
    }
  }

  formatValue() {
    return this.currency
      ? Number(this.value).toLocaleString(
          'pt-BR',
          {
            style: 'currency',
            currency: 'BRL'
          }
        )
      : this.value;
  }
}
