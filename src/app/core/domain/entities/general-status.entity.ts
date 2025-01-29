export class GeneralStatus {
    private _queroLer: number;
    private _lendo: number;
    private _lido: number;
    private _emprestado: number;
    private _relendo: number;
    private _interrompido: number;

    constructor(
        queroLer: number,
        lendo: number,
        lido: number,
        emprestado: number,
        relendo: number,
        interrompido: number
    ) {
        this._queroLer = queroLer;
        this._lendo = lendo;
        this._lido = lido;
        this._emprestado = emprestado;
        this._relendo = relendo;
        this._interrompido = interrompido;
    }

    get queroLer(): number {
        return this._queroLer;
    }

    set queroLer(value: number) {
        this._queroLer = value < 0 ? 0 : value;
    }

    get lendo(): number {
        return this._lendo;
    }

    set lendo(value: number) {
        this._lendo = value < 0 ? 0 : value;
    }

    get lido(): number {
        return this._lido;
    }

    set lido(value: number) {
        this._lido = value < 0 ? 0 : value;
    }

    get emprestado(): number {
        return this._emprestado;
    }

    set emprestado(value: number) {
        this._emprestado = value < 0 ? 0 : value;
    }

    get relendo(): number {
        return this._relendo;
    }

    set relendo(value: number) {
        this._relendo = value < 0 ? 0 : value;
    }

    get interrompido(): number {
        return this._interrompido;
    }

    set interrompido(value: number) {
        this._interrompido = value < 0 ? 0 : value;
    }
}
