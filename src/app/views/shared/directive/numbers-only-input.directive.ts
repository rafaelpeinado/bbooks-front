import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appNumbersOnlyInput]'
})
export class NumbersOnlyInputDirective {

  constructor(private readonly elRef: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this.elRef.nativeElement.value;
    this.elRef.nativeElement.value = initalValue.replace(/\D*/g, '');
    if ( initalValue !== this.elRef.nativeElement.value) {
      event.stopPropagation();
    }
  }

}
