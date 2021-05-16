import { Salario } from './../classes/Salario';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
  @Input() salario: Salario;
  @Input() calculandoDados = false;
  @Output() valueChanged = new EventEmitter();

  idInputSalarioBruto = 'inputSalarioBruto';

  constructor() {}

  ngOnInit(): void {
    /**
     * Forçando o autofocus no primeiro
     * input da tela
     */
    const firstInput = document.querySelector('input');
    firstInput.focus();
  }

  changeValue(newSalario) {
    this.valueChanged.emit(newSalario);
  }
}
