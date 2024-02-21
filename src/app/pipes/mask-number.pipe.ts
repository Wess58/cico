import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskNumber'
})
export class MaskNumberPipe implements PipeTransform {

  transform(value: string): any {
    if (value) {
      const number:any = value.match(/(\d{4})(\d{3})(\d{3})/);
      return value = number[1] + '***' + number[3];
    }
  }

}
