import {Action} from '@ngrx/store';
export enum PageActionTypes {
  Open_Page = 'OpenPage',

  Close_Page = 'ClosePage'
}
export class OpenPage implements Action {
    readonly type = PageActionTypes.Open_Page
    constructor(public payload: any){}
}



export class ClosePage implements Action {
    readonly type = PageActionTypes.Close_Page
    constructor(public payload: any){}
}

export type PageActions = OpenPage | ClosePage