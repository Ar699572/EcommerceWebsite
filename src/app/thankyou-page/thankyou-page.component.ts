import { Component, Injectable, Input, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { APICallingService } from '../model/APICallingService';
import { loginDetails } from '../UserDetails';
import * as $ from 'jquery'
@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-thankyou-page',
  templateUrl: './thankyou-page.component.html',
  styleUrls: ['./thankyou-page.component.css']
})
export class ThankyouPageComponent implements OnInit {

 
  loginUserDetails: any;
  orderNo:string="";
  constructor(private router: Router,private store: Store<any>, private APICALL: APICallingService,private route: ActivatedRoute) { 
    

  }

  ngOnInit(): void {
    debugger;
   
    $("#preloader").show();
    try{
      // this.route.queryParamMap
      // .subscribe((params:any) => {
      //   this.orderNo= params.params.orderNo;
      // })
        this.loginUserDetails = new loginDetails();
   
    var result = (this.store as any).source['value']['MSECOM'].filter((x: any) => { return x.viewName == "loginDetails"; });
    if (result.length > 0) {
     
      this.loginUserDetails = (Object.assign({}, result[0]));
    }
   //this.orderNo=this.GetOrderNo();

   this.ViewOrdersByuserId()
    
    
  }catch(e){
    console.log(e)
  }
  }
  GetOrderNo(){
debugger;
return sessionStorage.getItem('orderno')

  }
  lstofOrders:any=[];
  DbResult:any=[];
 ViewOrdersByuserId(){
  this.APICALL.DBCalling('OrderDetailsByUserID',this.loginUserDetails.UserID,'','','').subscribe(
    (res) => {
debugger;
            $("#loaderParent").hide();
            this.DbResult= (res);
            
            if(this.DbResult.tasks.length>0 )
            {
            this.lstofOrders=this.DbResult.tasks[0];
            this.orderNo=this.lstofOrders[0].OrderTrackingNumber;
            let len=this.lstofOrders.length-1;
            for(var i=0;i<this.lstofOrders.length;i++){
            if(this.lstofOrders[i].Details!=null && typeof(this.lstofOrders[i].Details)!=undefined)
            {
            debugger;
            try{
            if(len==i){
              var Array=((this.lstofOrders[i].Details).replace(/\n/g, "")).replace(/'/g,"\"");
              this.lstofOrders[i].Details=JSON.parse(Array);
              break;
            }else{
              var Array=((this.lstofOrders[i].Details).replace(/\n/g, "")).replace(/'/g,"\"");
              this.lstofOrders[i].Details=JSON.parse(Array);
            }

            $("#preloader").hide();
            console.log(Array)
            }
            catch(error){console.log(error)}
            }
            }
             this.SendMailTouser(this.loginUserDetails.UserFirstName,this.loginUserDetails.UserEmail,this.lstofOrders[0])
            }
            });
   
}

SendMailTouser(CustomerName,CustomerEmail,orderHistory){

  this.APICALL.SendEmail(CustomerName,CustomerEmail,'order Confirmation'+orderHistory.OrderTrackingNumber,orderHistory).subscribe((res)=>
  {
   console.log(res) 
  })

}
  orderClick(){
    this.router.navigateByUrl('orders');
  }

  ngAfterViewInit(){
    this.orderNo=this.GetOrderNo()
  }
}
