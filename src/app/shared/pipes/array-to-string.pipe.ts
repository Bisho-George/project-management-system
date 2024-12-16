import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'arrayToString' })
export class ArrayToStringPipe implements PipeTransform {
  transform(value: any[], separator: string = ', '): string {
    return Array.isArray(value) ? value.join(separator) : '';
  }
}
