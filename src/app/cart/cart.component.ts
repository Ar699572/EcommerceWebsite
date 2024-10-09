import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import * as PageStore from "src/app/Store/PageStore/Page.Actions";
import { Router } from '@angular/router';
import { Cart } from '../Cart';
import { Store } from '@ngrx/store';
import { AppSettings, IAppSettings } from '../model/AppSettings';
import { APICallingService } from '../model/APICallingService';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {


  hideTable:boolean=true;
  increaseClick(product,index)
  {
    product.Qty=(+product.Qty)+1;
    if(product.Qty>this.lstCartList[index].ProductQty){
      this.lstCartList[index].qtyValidation=true;
     }else{
      this.lstCartList[index].qtyValidation=false;
    this.lstCartList[index].Qty=product.Qty;

    this.lstCartList[index].ProductNetTotal=((+product.Qty)*(+product.SalesPrice)); 
    this.objCart.CalcTotals(this.lstCartList);
this.store.dispatch(new  PageStore.OpenPage({viewName:'CartList',lstCartList:this.lstCartList}));
     }
  }

  constructor(private store: Store<any>,public objCart:Cart,public appSettings:AppSettings,public router:Router,private apiCall:APICallingService)
  {
    
    this.storeSettings=   this.appSettings.loadSettings();
    this.cartDetails();
  }
  lstCartList=[];
cartDetails()
{
 
  
  let cartDetails = (this.store as any).source['value']['MSECOM'].filter((x:any) => {
    return x.viewName == 'CartList';
  });
  if( cartDetails.length > 0) {
    this.lstCartList=Object.assign([],  cartDetails[0].lstCartList);
   
    this.objCart.CalcTotals(this.lstCartList);

    this.checkDeliveryAvailability((+this.objCart.OrderGrossAmount));
   
    this.objCart.getCartQty(this.lstCartList);
  if(this.lstCartList.length==0){
    this.hideTable=false;
  }else{
    this.hideTable=true;
  }
  }
}

ContinueShopping(){
  

  this.router.navigateByUrl('/home');
}

ClearCart(){
  
  this.lstCartList=[]
  this.objCart.CalcTotals(this.lstCartList);
  this.store.dispatch(new  PageStore.OpenPage({viewName:'CartList',lstCartList:this.lstCartList}));
  this.hideTable=false;
}
  storeSettings:IAppSettings=
  {
      
      faxUserId:'',
      faxPassword:'',
      companyName:'',
      theamColorCode:'#ea0029',
      headerColorCode: '#000',
      headerimage: '../../assets/img/trending1.png',
      loginBackgroundImage:'../../assets/bg-1.jpg',
      loginImage:'../../assets/img/logo_web.png',
      dangerColorCode: '#dc3545',
      successColorCode: '#28a745',
      logo: '../../assets/img/logo_web.png',
      paymentGateway:'',
      key:'',
      selectedBranch:'',
      apiLoginId:'',
      orderEmail:'',
      adminUrl:'',
      orderUrl:'',
      viewName:'AppSettings',
      apiCallingUrl:'',
      fontFamily:'prompt,sans-serif',
      domainName:'',
      fax:'',
      projectId:'',
      
      keyNo:'',
      noOfBranches:0,
     
      currency:'',  
      transactionkey:'',
  };
  Currency:string="$"
  ngOnInit(): void {
     $("#preloader").hide()
  }
  addDays = (date: Date, days: number): Date => {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
  CouponDiscount=0;
  UserID=0;
  TotalDiscount=0;
  NetTotal=0;
  InvTax=0;
  ApplyCoupon()
  {
   let  CartTotal=((+this.objCart.OrderGrossAmount)- (+this.objCart.OrderDiscount));

    let CouponCode=$('#txtCouponCode').val();
    if(CouponCode!="")
  {
     $("#preloader").show();
    
    this.apiCall.DBCalling("GetDiscountFromCoupon",CouponCode,this.UserID,"","").subscribe(
      (res) => {
      //  $("#preloader").hide()
        
        let Result:any= (res);
      if(Result.tasks.length>0 )
      {
  
        if(Result.tasks[0].length>0 )
        {
           this.CouponDiscount=0;
          
         let MaxDiscountAmount:number=Result.tasks[0][0].MaxDiscountAmount;
         let FixedAmount:number=Result.tasks[0][0].FixedAmount;
         let MaxOrders:number=Result.tasks[0][0].MaxOrders;
         let Percentage:number=Result.tasks[0][0].Percentage;
         this.objCart.CouponDiscount=0;
         this.InvTax=this.objCart. getOrderTax();
        let DiscountableAmt=this.objCart.getOrderNetTotal();
  if((+MaxOrders)!=0)
  {
  if(CartTotal> (+MaxOrders))
  {
  
  if(FixedAmount!=0)
  {
  
    this.objCart.CouponDiscount=FixedAmount;
    this.CouponDiscount=(+FixedAmount);
  
  }else
  
  {
    this.CouponDiscount=( ( (+DiscountableAmt)*(+Percentage))/100);
  if(this.CouponDiscount>(+MaxDiscountAmount) && (+MaxDiscountAmount)!=0)
  {
  
    this.CouponDiscount=(+MaxDiscountAmount);
  
  }
  }
  
    }
  
  }else{
    if((+FixedAmount)!=0)
    {
    
      this.objCart.CouponDiscount=(+FixedAmount);
      this.CouponDiscount=(+FixedAmount);
      this.objCart.CouponDiscount=this.CouponDiscount;
      this.objCart.OrderDiscount=this.CouponDiscount;
    }else
    
    {
  
      this.objCart.CalcTotals(this.lstCartList);
      var TaxbleAmount=this.objCart.getTaxableAmount();
      this.CouponDiscount=( ( (TaxbleAmount)*(+Percentage))/100);
      
    if(this.CouponDiscount>(+MaxDiscountAmount)  &&  (+MaxDiscountAmount)>0)
    {
    
      this.CouponDiscount=(+MaxDiscountAmount);
    
    }
    }
    
  
  
  }
  
       
         this.objCart.CouponDiscount=this.CouponDiscount;
         this.objCart.CalcTotals(this.lstCartList);
         this.TotalDiscount=this.objCart.geTotalDiscount();
         
        
         this.InvTax=this.objCart. getOrderTax();
         this.NetTotal=this.objCart.getOrderNetTotal();
        }
      }else
      {
  
  //alert("Invalid Coupon");
  this.MsgType="warning!";
  this.ErrorMessage="Invalid Coupon";
  
  //(window as any). $('#myModal').modal('toggle');
  //(window as any).$("#myModal").modal();
  (window as any).$("#myModal").appendTo("body").modal('show');
      }
      
      ;
     
      
      });
  }
  }
  ErrorMessage='';
  MsgType='';
  DeliveryCharges=0;
  ExpectedDeliveryDays='';
  checkDeliveryAvailability(price)
  {
  


let storeDeliverySettings = (this.store as any).source['value']['MSECOM'].filter((x:any) => {
  return x.viewName == 'selectedZipCode';
});
if( storeDeliverySettings.length > 0) {
  let deliveryZipCode=Object.assign({},  storeDeliverySettings[0]);



 $("#preloader").show();

this.apiCall.DBCalling("CheckDeliveryAvailability",deliveryZipCode.deliveryZipCode,price,"","").subscribe(
    (res) => {
       $("#preloader").hide()
      
     let dbResult:any= (res);
if(dbResult.tasks.length>0)
{
  let ExpectedDeliveryDays=dbResult.tasks[0][0]['ExpectedDeliveryDays'];
  this.DeliveryCharges=(+dbResult.tasks[0][0]['DeliveryCharges']);
 
  try{
  const date: Date = new Date();
  const dateResult: Date = this.addDays(date, (+ExpectedDeliveryDays));
  
  this.ExpectedDeliveryDays = dateResult.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  }catch(e)
  {

  }

try{
 let maxDiscountAmount=(+dbResult.tasks[1][0]['MaxDiscountAmount'])
 let fixedAmount=(+dbResult.tasks[1][0]['FixedAmount'])
 let percentage=(+dbResult.tasks[1][0]['Percentage'])

let  perDiscount= percentage >0 ?((price*percentage)/100):0;



let disc=perDiscount>0?( (perDiscount>fixedAmount)?fixedAmount:perDiscount):(fixedAmount>0?((fixedAmount>maxDiscountAmount)?maxDiscountAmount:fixedAmount):maxDiscountAmount);

this.DeliveryCharges= this.DeliveryCharges-( disc>maxDiscountAmount?maxDiscountAmount:disc);
this.DeliveryCharges=this.DeliveryCharges>0?this.DeliveryCharges:0;

}catch(e)
{

}

}

      $("#preloader").hide()
    }
);
  }
  }
  removeClick(product,index)
  {
    
      this.lstCartList.splice(index,1);
   
    this.objCart.CalcTotals(this.lstCartList);
    if(this.lstCartList.length==0){
      this.hideTable=false;
    }else{
      this.hideTable=true;
    }
this.store.dispatch(new  PageStore.OpenPage({viewName:'CartList',lstCartList:this.lstCartList}));

  }
  decreaseClick(product,index)
  {
    product.Qty=(+product.Qty)-1;
    if(product.Qty<=0)
    {
      this.lstCartList.splice(index,1);
    }else{
      if(product.Qty>this.lstCartList[index].ProductQty){
        this.lstCartList[index].qtyValidation=true;
      }else{
      this.lstCartList[index].qtyValidation=false;
      }
      this.lstCartList[index].Qty=product.Qty;
      this.lstCartList[index].ProductNetTotal=((+product.Qty)*(+product.SalesPrice)); 
    }
    this.objCart.CalcTotals(this.lstCartList);
      this.store.dispatch(new  PageStore.OpenPage({viewName:'CartList',lstCartList:this.lstCartList}));

  }

  checkoutClick(){
    
    this.router.navigateByUrl('/checkout');
  }

}
