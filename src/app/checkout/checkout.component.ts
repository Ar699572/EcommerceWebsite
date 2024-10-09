import { Component, Injectable, NgZone, OnInit } from '@angular/core';
import { loginDetails } from '../UserDetails';
import { Store } from '@ngrx/store';
import { ActivatedRoute,Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { Cart } from '../Cart';
import {  AppSettings, IAppSettings } from '../model/AppSettings';
import { APICallingService } from '../model/APICallingService';
import * as PageStore from "src/app/Store/PageStore/Page.Actions";
import { PaymentgatwayModel } from '../../app/model/paymentgateway.model';
import { IPayPalConfig ,ICreateOrderRequest} from 'ngx-paypal';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { WindowRefService } from '../model/WindowRefService';

// @Injectable({
//   providedIn: 'root'
// })



@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  formValidation:boolean=false;
  public payment(response:any){
    debugger;

   if(response.messages.resultCode === "Error"){

   }else{
   
 
      this.objPaymentGatway.loadPaypal(this.orderTotal);
  
   }

  }
  
  storeSettings: IAppSettings =
    {
      faxUserId: '',
      faxPassword: '',
      companyName: '',
      theamColorCode: '#ea0029',
      headerColorCode: '#000',
      headerimage: '../../assets/img/trending1.png',
      loginBackgroundImage: '../../assets/bg-1.jpg',
      loginImage: '../../assets/img/logo_web.png',
      dangerColorCode: '#dc3545',
      successColorCode: '#28a745',
      logo: '../../assets/img/logo_web.png',
      paymentGateway: '',
      key: '',
      selectedBranch: '',
      apiLoginId: '',
      orderEmail: '',
      adminUrl: '',
      orderUrl: '',
      viewName: 'AppSettings',
      apiCallingUrl: '',
      fontFamily: 'prompt,sans-serif',
      domainName: '',
      fax: '',
      projectId: '',
      keyNo: '',
      noOfBranches: 0,
      currency: '₹',
      transactionkey: '',
    };
    paymentdisplay='none';
    ImagePath:string="";
  constructor(private store: Store<any>,private  objPaymentGatway:PaymentgatwayModel ,private route: ActivatedRoute,public appSettings:AppSettings, private zone: NgZone,private  LoginPage:AppComponent,private winRef: WindowRefService,private router: Router, private appCall: AppComponent, public objCart: Cart, private apiCall: APICallingService) {
    this.storeSettings=   this.appSettings.loadSettings();
    this.ImagePath=this.storeSettings.apiCallingUrl;
   }
   public  payPalConfig?: IPayPalConfig=this.objPaymentGatway.payPalConfig;
   public authorizenetConfig: any=this.objPaymentGatway.authorizenetConfig;
  
 
   public responseHandler(response:any) {
     debugger
     //Visit Api Reference for API Schema
     if (response.messages.resultCode === "Error") {
       var i = 0;
       while (i < response.messages.message.length) {
         console.log(
           response.messages.message[i].code + ": " +
           response.messages.message[i].text
         );
         i = i + 1;
       };
 
     }
     else {
 
       this.objPaymentGatway.payAuthorizeDotnetPayment(response.detail.opaqueData,this.orderTotal);
     }
    }


  lstInvalidstock:any=[];
  loginUserDetails: any;
  NavigateFrom:string="";
  ngOnInit(): void {
    debugger;
    this.loginUserDetails = new loginDetails();
    var result = (this.store as any).source['value']['MSECOM'].filter((x: any) => { return x.viewName == "loginDetails"; });
    if (result.length > 0) {
      $('#preloader').hide();
      this.loginUserDetails = (Object.assign({}, result[0]));
    }
    this.route.queryParamMap
    .subscribe((params:any) => {
       this.NavigateFrom=params.params.navigateFrom;


    })
    if(this.NavigateFrom=='BuyNow'){
      this.BuyDetails()
    }else{
      this.cartDetails();
    }
    
    this.getDeliverychrg()
    
   //this.PaypalPaymentgateway('')
  
   
  }

  // PaypalPaymentgateway(lstorder) {
  //   debugger;
  //   this.payPalConfig = {
  //       currency: 'USD',
  //       clientId: 'AfcoO2j__fJKFtVjqzuyoeqgu8dd0hbnIzHLJjketLVqHd3HYxIZ5ui6qOsO4IgE8amMp5gmyoG41bEh',
  //       createOrderOnClient: (data) => < ICreateOrderRequest > {
  //           intent: 'CAPTURE',
  //           purchase_units: [{
  //               amount: {
  //                   currency_code: 'USD',
  //                   value: lstorder.orderTotal,
  //                   breakdown: {
  //                       item_total: {
  //                           currency_code: 'USD',
  //                           value: lstorder.orderTotal
  //                       }
  //                   }
  //               },
  //               items: [{
  //                   name: 'Enterprise Subscription',
  //                   quantity: '1',
  //                   category: 'DIGITAL_GOODS',
  //                   unit_amount: {
  //                       currency_code: 'USD',
  //                       value: lstorder.orderTotal,
  //                   },
  //               }]
  //           }]
  //       },
  //       advanced: {
  //           commit: 'true'
  //       },
  //       style: {
  //           label: 'paypal',
  //           layout: 'vertical'
  //       },
  //       onApprove: (data, actions) => {
  //           console.log('onApprove - transaction was approved, but not authorized', data, actions);
  //           debugger;
  //           this.PaypalPaymentsuccess(data)
  //           actions.order.get().then((x:any) => {
  //               console.log('onApprove - you can get full order details inside onApprove: ', x);
  //           });
  
  //       },
  //       onClientAuthorization: (data) => {
  //           console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
  //          // this.showSuccess = true;
  //       },
  //       onCancel: (data, actions) => {
  //           console.log('OnCancel', data, actions);
  //          // this.showCancel = true;
  
  //       },
  //       onError: err => {
  //           console.log('OnError', err);
  //         //  this.showError = true;
  //       },
  //       onClick: (data, actions) => {
  //           console.log('onClick', data, actions);
  //          // this.resetStatus();
  //       }
  //   };
  // }
  loginClick() {
    // this.router.navigateByUrl('/userlogin');
    this.appCall.loginClick();
  }

  placeOrder() {
debugger;
if (this.loginUserDetails.UserID == 0) {

  this.LoginPage.loginClick()
}else if(this.loginUserDetails.UserEmail=='' ||this.loginUserDetails.UserFirstName==''  || this.loginUserDetails.UserLastName=='' || 
  this.loginUserDetails.UserAddress==''  || this.loginUserDetails.UserCity=='' || this.loginUserDetails.UserCountry=='' ||this.loginUserDetails.UserState=='' ||this.loginUserDetails.UserZip=='' ){
  this.formValidation=true;
    }else{
    this.formValidation=false;
   this.SaveOrder()
     
    }
  }

  loadpayment(){
    debugger;

    this.objPaymentGatway.loadPaymentGatway(this);
  }
 
  lstCartList = [];
  AppliedCouponCode: string = "";
  DbResult:any = [];
  cartDetails() {
    debugger;
    let cartDetails = (this.store as any).source['value']['MSECOM'].filter((x: any) => {
      return x.viewName == 'CartList';
    });
   
    
    if (cartDetails.length > 0 && typeof(cartDetails[0].lstCartList.length)!='undefined' && cartDetails[0].lstCartList.length!=0)  {
      this.lstCartList = Object.assign([], cartDetails[0].lstCartList);

      this.objCart.CalcTotals(this.lstCartList);
      this.objCart.getCartQty(this.lstCartList);
      
    }
  }

  BuyDetails(){
    
      debugger;
      let BuyProduct = (this.store as any).source['value']['MSECOM'].filter((x: any) => {
        return x.viewName == 'Buylst';
      });
      console.log(BuyProduct)
      if (BuyProduct.length > 0) {
        this.lstCartList = Object.assign([], BuyProduct[0].lstCartList);
        this.objCart.BuyNowTotals(this.lstCartList);
      }
   
    
  }
  Returntocart(){
    debugger;
    this.router.navigateByUrl('cart')
  }
  lstDeliveryCharges = [];
  getDeliverychrg() {
    debugger;
    $("#preloader").show();
    this.apiCall.DBCalling("GetDeliveryCharges", "", "", "", "").subscribe(
      (res) => {
        debugger;

        let DbResult: any = (res);

        if (DbResult.tasks.length > 0) {
          debugger;
          this.lstDeliveryCharges = DbResult.tasks[0];
          debugger;
          var result = (this.store as any).source['value']['MSECOM'].filter((x: any) => { return x.viewName == "selectedZipCode" });
          if (result.length > 0) {
            let delivery = this.lstDeliveryCharges.filter(x => x.PinCode === this.loginUserDetails.UserZip);
            if (delivery.length > 0) {
              this.DeliveryError='';
              this.objCart.DeliveryCharges = (+delivery[0].DeliveryCharges);
              this.ExpectedDeliveryDays=delivery[0].ExpectedDeliveryDays
            } else {
              this.DeliveryError = 'Delivery not possible at given pincode';
            }
          }

          if(this.objCart.OrderDiscount>0){
            this.couponstatus=true;
            $('#txtCouponCode').val(this.objCart.ApplyCouponCode)
          }
          $("#preloader").hide();



        }
      });

  }

 
  InvTax: number = 0;
  UserID: number = 0;
  NetTotal: number = 0;
  MsgType: string = '';
  ErrorMessage: string = '';
  TotalDiscount: number = 0;
  DeliveryError: string = "";
  mDeliveryCharges: number = 0;
  Zipcode(value) {
    debugger;

    let delivery = this.lstDeliveryCharges.filter(x => x.PinCode === value);
    if (delivery.length > 0) {
      debugger;
      this.DeliveryError = '';
      
      this.objCart.DeliveryCharges = (+delivery[0].DeliveryCharges);
      this.ExpectedDeliveryDays=(+delivery[0].ExpectedDeliveryDays)

      this.loginUserDetails.PinCode = value;
      this.store.dispatch(new PageStore.OpenPage(Object.assign({}, this.loginUserDetails)));
      this.store.dispatch(new PageStore.OpenPage({ viewName: 'selectedZipCode', Pincode: value }));
    } else {
      this.DeliveryError = 'Delivery not possible at given pincode';
      this.ExpectedDeliveryDays=0;
      this.objCart.DeliveryCharges = 0;
    }


  }
  couponstatus: boolean = false;
  couponError: string = "";

  ClearCoupon() {
    this.couponstatus = false;
    $('#txtCouponCode').val('');
    this.lstCartList[0].ProductDiscount = 0;
    this.objCart.OrderDiscount = 0;
    this.couponError = '';
    this.couponaplymsg = '';
    
   this.objCart.ApplyCouponCode = '';
   this.objCart.CalcTotals(this.lstCartList)

  }
  couponaplymsg:string='';
  ApplyCoupon() {
    debugger;

    let CartTotal = (+this.objCart.OrderGrossAmount);
    let CouponCode = $('#txtCouponCode').val();
    this.AppliedCouponCode = CouponCode.toString();
    this.UserID=this.loginUserDetails.UserID==0 ? this.UserID:this.loginUserDetails.UserID;
    if (CouponCode != "") {

      debugger;
      this.apiCall.DBCalling("GetDiscountFromCoupon", CouponCode, this.UserID, "", "").subscribe(
        (res) => {
          try{
          debugger;
          let Result: any = (res);
          if (Result.tasks.length > 0) {

            this.couponstatus = true;
            this.couponError = '';
            this.couponaplymsg = '';
            let DiscountType: string=Result.tasks[0][0].RuleType;
            let MaxDiscountAmount: number = Result.tasks[0][0].MaxDiscountAmount;
            let FixedAmount: number = Result.tasks[0][0].FixedAmount;
            let MaxOrders: number = Result.tasks[0][0].MaxOrders;
            let DiscountPer: number = Result.tasks[0][0].Percentage;

            if (FixedAmount != 0) {
              debugger;
              this.couponstatus = true;
              this.lstCartList[0].ProductDiscount = (+FixedAmount);
              this.objCart.OrderDiscount = (+FixedAmount);
              this.objCart.ApplyCouponCode = CouponCode.toString();
              this.objCart.CouponDiscount = (+FixedAmount);
              this.couponaplymsg = 'Applied coupon successfully !..'
            } else if (DiscountPer != 0 && MaxDiscountAmount!=0 && DiscountType=='NewCustomer') {
              debugger;
              this.couponstatus = true;
              var ApplyDiscountAmt = (+this.objCart.OrderGrossAmount) * (+DiscountPer) / 100;
              ApplyDiscountAmt=(+ApplyDiscountAmt)>MaxDiscountAmount ? MaxDiscountAmount:ApplyDiscountAmt;
              this.lstCartList[0].ProductDiscount =ApplyDiscountAmt;
              this.lstCartList[0]['ApplyCouponCode'] = CouponCode.toString();
              this.objCart.CouponDiscount=ApplyDiscountAmt;
              this.objCart.OrderDiscount = ApplyDiscountAmt;
              this.objCart.ApplyCouponCode = CouponCode.toString();
              this.couponaplymsg = 'Applied coupon successfully !..'
              this.objCart.CouponDiscount = ApplyDiscountAmt;
            } 
            else if (DiscountPer != 0 && MaxDiscountAmount!=0 && DiscountType=='Invoice') {
              debugger;
              this.couponstatus = true;
              var ApplyDiscountAmt = (+this.objCart.OrderGrossAmount) * (+DiscountPer) / 100;
              ApplyDiscountAmt=(+ApplyDiscountAmt)>MaxDiscountAmount ? MaxDiscountAmount:ApplyDiscountAmt;
              this.lstCartList[0].ProductDiscount =ApplyDiscountAmt;
              this.lstCartList[0]['ApplyCouponCode'] = CouponCode.toString();
              this.objCart.CouponDiscount=ApplyDiscountAmt;
              this.objCart.OrderDiscount = ApplyDiscountAmt;
              this.objCart.ApplyCouponCode = CouponCode.toString();
              this.couponaplymsg = 'Applied coupon successfully !..'
              this.objCart.CouponDiscount = ApplyDiscountAmt;
            } 
          } else {
            // if get empty result
            this.couponstatus = false;
            this.couponError = 'Invalid Coupon Code'
        //    this.objCart.ApplyCouponCode='';
          }
          this.objCart.CalcTotals(this.lstCartList)
          this.store.dispatch(new PageStore.OpenPage({viewName: "CartList", lstCartList :this.lstCartList})) 
         
       
        }catch(e){
    console.log(e)
        }
      
        });
    }
  }

  closeLoginModal(){
    this.paymentdisplay='none';

  }
  closeModalPopup(){
    this.StockValidationdisplay=false;
  }

IsguestUser:boolean=false;
Orderstatus:string="Open";
PaidStatus:number=0;
OrderNo:string="";
OrderDate:string="";
orderTotal:number=0;
ExpectedDeliveryDays:number=0;
stripepayment(trdata,lstdata){
  debugger;
 var orderid=lstdata.DbResult.tasks[0][0].OrderID
    
   $("#loaderParent").show();
  //  OrderPaymentDetailsUpdate
  this.apiCall.DBCalling('OrderPaymentDetailsUpdate',orderid,trdata.id,trdata.id,trdata.type).subscribe(
     (res) => {
      $("#loaderParent").hide();
     this.DbResult= (res);
     if(this.DbResult.tasks.length>0 )
     {
     // this.sweetalert()
   
     this.router.navigateByUrl('thankyoupage');
     }
    });

}
StockValidationdisplay:boolean=false;
CheckStockByProducts(){
  debugger;

  var xml="";
  var rows='';
  for(let i=0;i<this.lstCartList.length;i++){
    rows=rows+'<Table1>'
    +'<ProductOptionID>'+(typeof(this.lstCartList[i].ProductOptionID)=='undefined'?'0':this.lstCartList[i].ProductOptionID)+'</ProductOptionID>'
    +'<Qty>'+(typeof(this.lstCartList[i].Qty)=='undefined'?'0':this.lstCartList[i].Qty)+'</Qty>'
    +'</Table1>'
  }
  xml='<NewDataSet>'+rows+'</NewDataSet>';
  this.apiCall.DBCalling('checkStock',xml,'','','').subscribe(
    (res) => {
      debugger;
      var DbResult:any= (Object.assign([],res));
      console.log(res)
      if(DbResult.tasks[0][0].stockstatus=='Sufficient Stock'){
        this.StockValidationdisplay=false;
        this.placeOrder();
        
      }else{
        this.lstInvalidstock=Object.assign([],DbResult.tasks[0]);
    
        //open pop-up throught boolean 
        
        this.StockValidationdisplay=true;
      }

     
    }
  )  
 
}
async  SaveOrder() {
    debugger;
   
   
    var UserID = this.loginUserDetails.UserID;
    var UserName = this.loginUserDetails.UserFirstName + this.loginUserDetails.UserLastName;

    this.IsguestUser=(this.loginUserDetails.UserID)===0 ? true:false;

    var xml1 = "";
    var xml2 = "";
    var xml3 = "";
    debugger;
    debugger;
    var xml1='<NewDataSet><Table1>'
      +'<UserID>'+(typeof( UserID)=='undefined'?'0': UserID)+'</UserID>'
      +'<OrderShipName>'+(typeof(UserName)=='undefined'?'0':UserName)+'</OrderShipName>'
      +'<ShippingFirstName>'+this.loginUserDetails.UserFirstName+'</ShippingFirstName>'
      +'<ShippingLastName>'+this.loginUserDetails.UserLastName+'</ShippingLastName>'
      +'<DeliveryAddress>'+this.loginUserDetails.UserAddress+'</DeliveryAddress>'
      +'<City>'+this.loginUserDetails.UserCity+'</City>'
        +'<State>'+this.loginUserDetails.UserState+'</State>'
        +'<Zip>'+this.loginUserDetails.UserZip+'</Zip>'
        +'<Country>'+this.loginUserDetails.UserCountry+'</Country>'
        +'<PhoneNo>'+this.loginUserDetails.UserMobile+'</PhoneNo>'
        +'<BillingFirstName>'+this.loginUserDetails.UserFirstName+'</BillingFirstName>'
        +'<BillingLastName>'+this.loginUserDetails.UserLastName+'</BillingLastName>'
          +'<BillingCity>'+this.loginUserDetails.UserCity+'</BillingCity>'
          +'<BillingState>'+this.loginUserDetails.UserState+'</BillingState>'
          +'<BillingZip>'+this.loginUserDetails.UserZip+'</BillingZip>'
          +'<BillingCountry>'+this.loginUserDetails.UserCountry+'</BillingCountry>'
          +'<BillingAddress>'+this.loginUserDetails.UserAddress+'</BillingAddress>'
          +'<BillingMobile>'+this.loginUserDetails.UserMobile+'</BillingMobile>'
        +'<IsGuestUser>'+this.IsguestUser+'</IsGuestUser>'
        +'<DeliveryType>'+'Deliver'+'</DeliveryType>'
        +'<PickupLocation>'+''+'</PickupLocation>'
        +'<UserMobile>'+this.loginUserDetails.UserMobile+'</UserMobile>'
        +'<CouponCode></CouponCode>'
        +'<CouponDiscount>'+this.objCart.CouponDiscount+'</CouponDiscount>'
        +'<OrderDiscount>'+this.objCart.OrderDiscount+'</OrderDiscount>'
        +'<OrderTax>'+((+this.objCart.CGSTAmt)+(+this.objCart.SGSTAmt))+'</OrderTax>'
        +'<DeliveryCharges>'+this.objCart.DeliveryCharges+'</DeliveryCharges>'
        +'<OrderNetTotal>'+((+this.objCart.OrderNetTotal)-(+this.objCart.OrderDiscount) + (+this.objCart.DeliveryCharges))+'</OrderNetTotal>'
        +'<OrderGrossAmount>'+this.objCart.OrderGrossAmount+'</OrderGrossAmount>'
        +'<Fld1></Fld1>'
        +'<Fld2></Fld2>'
        
        +'<EmailId>'+this.loginUserDetails.UserEmail+'</EmailId>'
        +'<OrderStatus>'+this.Orderstatus+'</OrderStatus>'
        +'<PaidStatus>'+this.PaidStatus+'</PaidStatus>'
        +'</Table1></NewDataSet>';
    var rows = "";

    var rows="";

    
    if(typeof(this.lstCartList)!='undefined' &&  this.lstCartList!=null)
    {
    for(var i=0;i<this.lstCartList.length;i++)
    {

      debugger;
    if(this.lstCartList[i].ProductID!="" && typeof(this.lstCartList[i].ProductID)!='undefined'  )
      rows= rows+'<Table1>'
      +'<OrderID>'+(typeof(this.lstCartList[i].OrderID)=='undefined'?'0':this.lstCartList[i].OrderID)+'</OrderID>'
      +' <OrderDetailsID>0</OrderDetailsID>'
      +'<ProductOptionID>'+(typeof(this.lstCartList[i].ProductOptionID)=='undefined'?'0':this.lstCartList[i].ProductOptionID)+'</ProductOptionID>'
      +'<ExpectedDeliveryDays>'+this.ExpectedDeliveryDays+'</ExpectedDeliveryDays>'
      +'<MerchantID>'+(typeof(this.lstCartList[i].MerchantID)=='undefined'?'0':this.lstCartList[i].MerchantID)+'</MerchantID>'
      +'<ProductSKU>'+(typeof(this.lstCartList[i].ProductCode)=='undefined'?'':this.lstCartList[i].ProductCode)+'</ProductSKU>'
      +'<ProductImage>'+(typeof(this.lstCartList[i].ProductImage)=='undefined'?'':this.lstCartList[i].ProductImage)+'</ProductImage>'
      +'<ExtraPieces>'+0+'</ExtraPieces>'
      +'<ParentID>0</ParentID>'
      +'<IsWishListItem>'+(typeof(this.lstCartList[i].IsWishListItem)=='undefined'?'':this.lstCartList[i].IsWishListItem)+'</IsWishListItem>'
      +'<ProductName>'+(typeof(this.lstCartList[i].ProductName)=='undefined'?'':this.lstCartList[i].ProductName)+'</ProductName>'
      +'<ProductOptions>'+(typeof(this.lstCartList[i].ProductOptions)=='undefined'?'':this.lstCartList[i].ProductOptions)+'</ProductOptions>'
      +'<Qty>'+(typeof(this.lstCartList[i].Qty)=='undefined'?'0':this.lstCartList[i].Qty)+'</Qty>'
      +'<Price>'+(typeof(this.lstCartList[i].SalesPrice)=='undefined'?'0':this.lstCartList[i].SalesPrice)+'</Price>'
      +'<ProductTax>'+(typeof(this.lstCartList[i].ProductTax)=='undefined'?'0':this.lstCartList[i].ProductTax)+'</ProductTax>'
      +'<ProductDiscount>'+(typeof(this.lstCartList[i].ProductDiscount)=='undefined'?'0':this.lstCartList[i].ProductDiscount)+'</ProductDiscount>'
      +'<ProductNetTotal>'+(typeof(this.lstCartList[i].ProductNetTotal)=='undefined'?'0':this.lstCartList[i].ProductNetTotal)+'</ProductNetTotal>'
      +'<OrderDetailsStatus>Open</OrderDetailsStatus>'
      +'</Table1>'

      
      if((typeof(this.lstCartList[i].ExtraPieces)=='undefined'?'':this.lstCartList[i].ExtraPieces)!='')
      {
        var lstChild=this.lstCartList[i].lstSet;
    for(let c=0;c<lstChild.length;c++)
    {
      rows= rows+'<Table1>'
      +'<OrderID>'+(typeof(this.lstCartList[i].OrderID)=='undefined'?'0':this.lstCartList[i].OrderID)+'</OrderID>'
      +' <OrderDetailsID>0</OrderDetailsID>'
      +'<ProductOptionID>'+(typeof(this.lstCartList[i].ProductOptionID)=='undefined'?'0':lstChild[c].ProductOptionID)+'</ProductOptionID>'
      +'<ExpectedDeliveryDays>'+''+'</ExpectedDeliveryDays>'
      +'<MerchantID>'+(typeof(lstChild[c].MerchantID)=='undefined'?'0':lstChild[c].MerchantID)+'</MerchantID>'
      +'<ProductSKU>'+(typeof(lstChild[c].ProductCode)=='undefined'?'':lstChild[c].ProductCode)+'</ProductSKU>'
      +'<ProductImage>'+(typeof(lstChild[c].ProductImage)=='undefined'?'':lstChild[c].ProductImage)+'</ProductImage>'
      
      +'<ExtraPieces>'+(typeof(lstChild[c].ExtraPieces)=='undefined'?'':lstChild[c].ExtraPieces)+'</ExtraPieces>'
      +'<ParentID>'+(typeof(lstChild[c].ParentID)=='undefined'?'0':lstChild[c].ParentID)+'</ParentID>'
    
      +'<IsWishListItem>'+(typeof(lstChild[c].IsWishListItem)=='undefined'?'':lstChild[c].IsWishListItem)+'</IsWishListItem>'
      +'<ProductName>'+(typeof(lstChild[c].ProductName)=='undefined'?'':lstChild[c].ProductName)+'</ProductName>'
      +'<ProductOptions>'+(typeof(lstChild[c].ProductOptions)=='undefined'?'':lstChild[c].ProductOptions)+'</ProductOptions>'
      
      +'<Qty>'+(typeof(lstChild[c].Qty)=='undefined'?'0':lstChild[c].Qty)+'</Qty>'
      +'<Price>'+(typeof(lstChild[c].SalesPrice)=='undefined'?'0':lstChild[c].SalesPrice)+'</Price>'
      +'<ProductTax>'+(typeof(lstChild[c].ProductTax)=='undefined'?'0':lstChild[c].ProductTax)+'</ProductTax>'
      +'<ProductDiscount>'+(typeof(lstChild[c].ProductDiscount)=='undefined'?'0':lstChild[c].ProductDiscount)+'</ProductDiscount>'
      +'<ProductNetTotal>'+(typeof(lstChild[c].ProductNetTotal)=='undefined'?'0':lstChild[c].ProductNetTotal)+'</ProductNetTotal>'
      +'<OrderDetailsStatus>Open</OrderDetailsStatus>'
      +'</Table1>'


    }

      }
    
    }
    }
    if(rows=="")
    {
      xml2= '<NewDataSet><Table1></Table1></NewDataSet>';
    }else{
    
      xml2= '<NewDataSet>'+rows+'</NewDataSet>';
    }
    
  debugger;

  
  var xml3='<NewDataSet><Table1>'
  +'<UserEmail>'+this.loginUserDetails.UserEmail+'</UserEmail>'
  +'<UserPassword>'+this.loginUserDetails.UserPassword+'</UserPassword>'
  +'<UserFirstName>'+this.loginUserDetails.UserFirstName+'</UserFirstName>'
  +'<UserLastName>'+this.loginUserDetails.UserLastName+'</UserLastName>'
    +'<UserCity>'+this.loginUserDetails.UserCity+'</UserCity>'
    +'<UserState>'+this.loginUserDetails.UserState+'</UserState>'
    +'<UserZip>'+this.loginUserDetails.UserZip+'</UserZip>'
    +'<UserEmailVerified>'+this.loginUserDetails.UserEmail+'</UserEmailVerified>'
    +'<UserCountry>'+this.loginUserDetails.UserCountry+'</UserCountry>'
    +'<UserAddress>'+this.loginUserDetails.UserAddress+'</UserAddress>'
    +'<UserMobile>'+this.loginUserDetails.UserMobile+'</UserMobile>'
    +'<IsGuestUser>'+this.IsguestUser+'</IsGuestUser>'
    +'</Table1></NewDataSet>';



   debugger
  //  
   this.apiCall.DBCalling('SaveOrder',xml1,xml2,xml3,'').subscribe(
    (res) => {

  debugger;
  $("#loaderParent").hide();
  this.DbResult= (Object.assign([],res));
  
  if(this.DbResult.tasks[0].length>0){
    var DbResult=this.DbResult;
    var lst=DbResult.tasks[0][0];
    this.OrderNo=DbResult.tasks[0][0].OrderTrackingNumber;
    this.OrderDate=DbResult.tasks[0][0].OrderDate;
    this.orderTotal=((+this.objCart.OrderNetTotal)-(+this.objCart.OrderDiscount) + (+this.objCart.DeliveryCharges));
    
    sessionStorage.removeItem('orderno');
    sessionStorage.setItem('orderno', this.OrderNo)
    this.apiCall.SendEmail((this.loginUserDetails.UserFirstName+this.loginUserDetails.UserLastName),this.loginUserDetails.UserEmail,'Order Summary',this.lstCartList)

 
  // PAYPAL calling method  from itself own component
   // this.PaypalPaymentgateway(this)
    this.objPaymentGatway.loadPaymentGatway(this);
 
  //  authorize.net payment calling from paymentgetwaymodel
  // this.paymentdisplay=PaymentgatwayModel.paymentdisplay;
 // this.objPaymentGatway.loadPaymentGatway(this);

//  stripe payment gateway 
// this.paymentdisplay=PaymentgatwayModel.paymentdisplay
// this.objPaymentGatway.loadPaymentGatway(this);


// razor pay 
// this.paymentdisplay=PaymentgatwayModel.paymentdisplay;
// this.objPaymentGatway.loadPaymentGatway(this);

  }

  });
 
    
  
} 


PaypalPaymentsuccess(data){
  debugger;
 var orderid=this.DbResult.tasks[0][0].OrderID
    console.log(sessionStorage)
   $("#loaderParent").show();
  //  OrderPaymentDetailsUpdate
  this.apiCall.DBCalling('OrderPaymentDetailsUpdate',orderid,data.payerID,data.orderID,data.paymentSource).subscribe(
     (res) => {
      $("#loaderParent").hide();
     this.DbResult= (res);
   
     if(this.DbResult.tasks.length>0 )
     {
    debugger;
     // this.sweetalert()
   
     this.router.navigateByUrl('thankyoupage');
      this.paymentdisplay='none';
     }
    });
  
   
  
}

Razorpaymentsuccess(Paymentrefid){
  debugger;
  var orderid=this.DbResult.tasks[0][0].OrderID;
 
  
  $("#loaderParent").show();
  //  OrderPaymentDetailsUpdate
  this.apiCall.DBCalling('OrderPaymentDetailsUpdate',orderid,Paymentrefid,Paymentrefid,Paymentrefid).subscribe(
     (res) => {
      debugger;
      $("#loaderParent").hide();
     this.DbResult= (res);
   
     if(this.DbResult.tasks.length>0 )
     {
      debugger;
      
        this.lstCartList=[];
        this.objCart.CalcTotals(this.lstCartList)
        this.store.dispatch(new  PageStore.OpenPage( {viewName:'CartList',lstCartList:this.lstCartList}));
      

      this.paymentdisplay='none';
      // this.router.navigate(
      //   ['/thankyoupage']
         
      // );
      $('#preloader').show();
     this.router.navigateByUrl('/thankyoupage')
     $('#preloader').hide();
     }
    });
  
}
sweetalert(){
  Swal.fire({
    icon: 'success',
    title: 'Thank you!...',
    text: 'Your order placed successfully!..',
    
  })

  this.router.navigateByUrl('thankyoupage');
 
}

ngAfterViewInit()
{
 PaymentgatwayModel.pageComponent=this;


}





}
