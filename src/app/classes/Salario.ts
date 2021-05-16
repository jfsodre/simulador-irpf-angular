const tabelaIRPF_2021 = [
  {
    ate: 1903.98,
    aliquota: 0,
    deducao: 0
  },
  {
    ate: 2826.65,
    aliquota: 7.5,
    deducao: 142.8
  },
  {
    ate: 3751.05,
    aliquota: 15.0,
    deducao: 354.8
  },
  {
    ate: 4664.68,
    aliquota: 22.5,
    deducao: 636.13
  },
  {
    ate: Number.MAX_SAFE_INTEGER,
    aliquota: 27.5,
    deducao: 869.36
  }
];

export class Salario {
  _salarioBruto: number = undefined;
  _baseIRPF: number = undefined;
  _descontoIRPF: number = undefined;
  _salarioLiquido: number = undefined;

  /**
   * Construtor
   * @param {number} O salário bruto, que deve ser um
   * número maior ou igual a 0
   */
  constructor(pSalarioBruto: number) {
    this._validarSalarioBruto(pSalarioBruto);
    this._realizarCalculos();

    // Congelando o objeto para evitar modificações
    Object.freeze(this);
  }

  private _validarSalarioBruto(pSalarioBruto: number) {
    /**
     * Regras de validação
     */
    if (
      pSalarioBruto === undefined ||
      typeof pSalarioBruto !== 'number' ||
      pSalarioBruto < 0
    ) {
      throw new Error(
        'O parâmetro do salário bruto ' +
          'é obrigatório e deve ser um ' +
          'valor do tipo number maior ou igual a 0!'
      );
    }

    // Salário bruto validado!
    this._salarioBruto = pSalarioBruto;
  }

  private _realizarCalculos() {

      this._baseIRPF = this._salarioBruto ;
    this._descontoIRPF = this._calcularDescontoIRPF();
    this._salarioLiquido =
      this._salarioBruto - this._descontoIRPF;
  }

    

  /**
   * O cálculo é bastante semelhante ao do INSS,
   * exceto pelo teto, que não existe e pela aplicação
   * da dedução
   */
  _calcularDescontoIRPF() {
    let descontoIRPF = 0;

    for (const item of tabelaIRPF_2021) {
      if (this._baseIRPF <= item.ate) {
        descontoIRPF = this._baseIRPF * (item.aliquota / 100);

        // Aplicando a dedução
        descontoIRPF -= item.deducao;
        break;
      }
    }

    return descontoIRPF;
  }

  /**
   * Getters com um mínimo de formatação
   */
  get salarioBruto() {
    return this._salarioBruto.toFixed(2);
  }

  get baseIRPF() {
    return this._baseIRPF.toFixed(2);
  }

  get descontoIRPF() {
    return this._descontoIRPF.toFixed(2);
  }

  get totalDescontos() {
    return (this._descontoIRPF).toFixed(2);
  }

  get salarioLiquido() {
    return this._salarioLiquido.toFixed(2);
  }
}
