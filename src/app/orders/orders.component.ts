import { Component, OnInit } from '@angular/core';
import { APICallingService } from '../model/APICallingService';
import { loginDetails } from '../UserDetails';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { Cart } from '../Cart';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  loginUserDetails: any;
  lstoforders:any=[];
  DbResult:any=[];

 
  constructor(private store: Store<any>,private apiCall: APICallingService,private fb:FormBuilder,public router:Router) { 


  
   
  }

  ngOnInit() {
    debugger;

    $("#preloader").show();
    this.loginUserDetails = new loginDetails();
    var result = (this.store as any).source['value']['MSECOM'].filter((x: any) => { return x.viewName == "loginDetails"; });
    if (result.length > 0) {
     
      this.loginUserDetails = (Object.assign({}, result[0]));
    }
   
    this.vieworders();

   setTimeout(hide, 3000);
   function hide(){
    $("#preloader").hide();
  }
  }
 
  ActivateTab:string="Confirmed";
  lstofFilters:any=[];

 
  vieworders(){
    debugger;

   
    this.apiCall.DBCalling('OrderDetailsByUserID',this.loginUserDetails.UserID,'','','').subscribe(
      (res) => {
   
       $("#loaderParent").hide();
      this.DbResult= (res);
      if( this.DbResult.tasks.length==0){
        $("#loaderParent").hide();
      }
      else if(this.DbResult.tasks.length>0 )
      {
        this.lstoforders=this.DbResult.tasks[0];
        let len=this.lstoforders.length-1;
        for(var i=0;i<this.lstoforders.length;i++){
        if(this.lstoforders[i].Details!=null && typeof(this.lstoforders[i].Details)!=undefined)
        {
          debugger;
        try{
          if(len==i){
            var Array=((this.lstoforders[i].Details).replace(/\n/g, "")).replace(/'/g,"\"");
            this.lstoforders[i].Details=JSON.parse(Array);
            break;
          }else{
            var Array=((this.lstoforders[i].Details).replace(/\n/g, "")).replace(/'/g,"\"");
            this.lstoforders[i].Details=JSON.parse(Array);
          }

        
          
        }
        catch(error){console.log(error)}
        }
        }
        
        this.ActivateCollapse=this.lstoforders[0].OrderTrackingNumber;
        this.clickTab('Open')
        $("#preloader").hide();
      }else{
        $("#loaderParent").hide();
      }
     });
  }

  clickTab(CurrentTab){
    debugger;
    this.ActivateTab=CurrentTab;
    this.lstofFilters=[];
    
   var userorderDetails=this.lstoforders.filter(x=>x.OrderStatus === CurrentTab);
   if(userorderDetails.length>0){
    for(let i=0;i<userorderDetails.length;i++){
      this.lstofFilters.push(userorderDetails[i])
    }
    this.ActivateCollapse=this.lstofFilters[0].OrderTrackingNumber;
    
   }

  }

 
  ActivateCollapse:string='';
  click(ActivateAccordance){
    debugger;
    if(this.ActivateCollapse==ActivateAccordance){
      this.ActivateCollapse=''
    }else{
      this.ActivateCollapse=ActivateAccordance;
    }
    
  }

  mail(d){

    
    this.apiCall.SendEmail('','','',this.lstoforders[1]).subscribe((res)=>
    {
    
    })
  }

  comment:string="";
  OrderDetailsId:number=0;
  OrderId:number=0;
  Ratingstar:number=0;
  getratingDetails(data){
    debugger;
    if(data!=''){
      
      this.OrderDetailsId=data.OrderDetailsID;
      this.OrderId=data.OrderID;
    }
  }
  SaveRatingByProduct(){
    debugger;
debugger;
    var xml1='<NewDataSet><Table1>'
    +'<OrderDetailsID>'+this.OrderDetailsId+'</OrderDetailsID>'
    +'<Rating>'+this.Ratingstar+'</Rating>'
    +'<comment>'+this.comment+'</comment>'
    +'</Table1></NewDataSet>';
    this.apiCall.DBCalling('UpdateOrderRatingByOrderID',xml1,this.comment,this.OrderId,'').subscribe(
      (res) => {
      debugger;
      this.DbResult= (Object.assign([],res));
          if(this.DbResult.tasks[0].length>0){
            this.vieworders()
            window.location.reload()
          }

      })



    
    }

    Startshoping(){
      debugger;
      this.router.navigateByUrl('/home');
    }
    // $(document).ready(function() {  
//   $("#star4").click(function() {  
//       $(".fa-star").css("color", "black");  
//       $("#star1, #star2, #sta r3, #star4").css("color", "yellow"); ;  
//   }).trigger('click');  
// });
}
