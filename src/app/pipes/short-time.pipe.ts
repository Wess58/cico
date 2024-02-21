import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortTime'
})
export class ShortTimePipe implements PipeTransform {

  transform(value: string): any {
    if (value) {
      value  = value.substring(0,5);
      return value;
    }
  }

}
