import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash'; 
@Pipe({ name: 'UniqueOptions',
pure: false})
export class UniqueOptions implements PipeTransform {
    transform(value: any): any{
        if(value!== undefined && value!== null){
            return _.uniqBy(value, 'OptionName');
        }
        return value;
    }
}