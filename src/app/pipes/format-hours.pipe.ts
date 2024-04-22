import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatHours'
})
export class FormatHoursPipe implements PipeTransform {

  transform(value: string): any {
    if (value) {
      return value = value.replace(' hours and', 'h,').replace(' minutes', 'm');
    }
  }

}
