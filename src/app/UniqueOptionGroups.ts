import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash'; 
@Pipe({ name: 'UniqueOptionGroups',
pure: false})
export class UniqueOptionGroups implements PipeTransform {
    transform(value: any): any{
        if(value!== undefined && value!== null){
            return _.uniqBy(value, 'OptionGroup');
        }
        return value;
    }
}