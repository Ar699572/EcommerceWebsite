import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { APICallingService } from './model/APICallingService';
import * as PageStore from "src/app/Store/PageStore/Page.Actions";

@Injectable({
    providedIn: 'root'
})


export class MyWishList {
    DbResult: any = [];
    Count: number = 0;
    MyWishlistproduct: any = [];
    constructor(private APICALL: APICallingService, private Store: Store<any>) {

    }


    GetDetailsfromWishList(UserId) {
    debugger;
    this.APICALL.DBCalling('ViewWishListDetByUserID', UserId, '', '', '').subscribe(
        (res) => {
            debugger;
            this.DbResult = (Object.assign([], res));
           
            if(this.DbResult.tasks.length>0 && this.DbResult.tasks.length!=0){
                this.MyWishlistproduct = this.DbResult.tasks[0];
                this.Store.dispatch(new PageStore.OpenPage({ viewName: 'Mywishlist', WishlistDetails: this.MyWishlistproduct }));
                    this.GetWishlistCount(this.MyWishlistproduct)
             
            }
          
           
            
        }
    )
    }

    GetWishlistCount(lstWishListDetails){
        
        this.Count = lstWishListDetails.length;

        $('#Mywishlistprdcount').html(this.Count.toString())
     this.Store.dispatch(new PageStore.OpenPage({ viewName: 'Mywishlist', WishlistDetails: lstWishListDetails }));
    }

       
}