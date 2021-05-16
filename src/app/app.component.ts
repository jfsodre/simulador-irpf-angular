import { Component } from '@angular/core';
import { Salario } from './classes/Salario';
import { interval } from 'rxjs';
import {takeUntil, map, filter} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  /**
   * Salário a ser monitorado
   */
  salario: Salario = new Salario(0);

  /**
   * Indicativo de cálculo em andamento
   */
  calculandoDados = false;

  updateSalario(newSalarioBruto) {
    const salarioBrutoNumber = +newSalarioBruto;
    this.salario = new Salario(salarioBrutoNumber);
  }

  calcularBrutoFromLiquidoDesejado(pSalarioLiquidoDesejado) {
    this.calculandoDados = true;
    const salarioLiquidoDesejado = +pSalarioLiquidoDesejado;

    this.salario = new Salario(salarioLiquidoDesejado);
    const inputSalarioBruto =
    (<HTMLInputElement>document.querySelector('#inputSalarioBruto'));

    /**
     * Criando observable que, a cada 1 milisegundo, incrementa
     * o salário bruto e o recalcula no estado da aplicação. Por
     * fim, retorna o salarioLiquido obtido após o cálculo.
     *
     */
    const obs$ = interval(1).pipe(
      /**
       * Transformação de dados (map)
       */
      map(() => {
        /**
         * Obtendo o salário líquido do momento
         */
        const currentValue = +this.salario.salarioLiquido;

        /**
         * Calculando a diferença entre o salário líquido do momento
         * e o salário líquido desejado
         */
        const difference = Math.abs(currentValue - salarioLiquidoDesejado);

        /**
         * Quando a diferença for menor que 5 reais, o
         * incremento passa a ser de 1 centavo (0.01)
         * para uma melhor precisão no cálculo sem que
         * o mesmo se torne lento, ou seja, enquanto a
         * diferença for maior que 5 reais o incremento
         * é de "1 em 1 real"
         */
        const increment = difference >= 5 ? 1 : 0.01;

        /**
         * Incrementando o valor no salário bruto
         * e formatando para 2 casas decimais
         */
        const novoSalario = +this.salario.salarioBruto + increment;

        inputSalarioBruto.value = novoSalario.toFixed(2);

        /**
         * Atualizando o salário bruto. Quando atualizamos o valor
         * "na mão", o Vue não consegue monitorar as
         * mudanças
         */
        this.salario = new Salario(novoSalario);

        /**
         * Por fim, retornamos o salário líquido atual
         */
        return this.salario.salarioLiquido;
      })
    );

    /**
     * Observable para ser utilizado com takeUntil,
     * que será a condição de término da execução
     * (salarioLiquido do estado maior ou igual ao salarioLiquido desejado)
     */
    const match$ = obs$.pipe(
      filter(currentValue => +currentValue >= salarioLiquidoDesejado)
    );

    /**
     * Acionamos, por fim, a execução do observable com
     * subscribe()
     */
    obs$
      .pipe(takeUntil(match$))
      .subscribe(null, null, () => (this.calculandoDados = false));
  }
}
