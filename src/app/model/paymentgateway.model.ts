import { Injectable, Renderer2, RendererFactory2 } from "@angular/core";
import {Component,  OnInit} from '@angular/core';
 import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import Swal from 'sweetalert2/dist/sweetalert2.js';

// import { AppSettings, IAppSettings } from "";
import { NgxAuthorizenetI } from 'ngx-authorizenet';

import { HttpClient } from '@angular/common/http';
import { WindowRefService } from "./WindowRefService";

import { APICallingService } from "./APICallingService";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root',
 })
  export class PaymentgatwayModel {
    public static pageComponent:any;
    private renderer: Renderer2 | undefined ;
    public payPalConfig ? : IPayPalConfig;
    public   authorizenetConfig?: NgxAuthorizenetI;
    paymentHandler:any = null;


    constructor( private http: HttpClient,rendererFactory: RendererFactory2,private router: Router,private winRef: WindowRefService,private apiCall: APICallingService)
    {
        // private storeAppSettings:AppSettings
      this.renderer = rendererFactory.createRenderer(null, null); 
      debugger;
     // this.storeSettings=this.storeAppSettings.loadSettings();
    
     this.loadStripe()
      this.authorizenetConfig={
        billingAddressOptions: '{"show":true, "required":false}',
        urlAction: 'https://api.yourdomain.com/authorizepay/callback',
        apiLoginID: '5e7kLDcb82',
        clientKey:'3L9eF8sg6r9uEcrVhEwvU7DkTr4s653AG584DbG6z8LHh7mLmbBHYTsdt5MCAW4B',
        acceptUIFormBtnTxt: 'Pay Now',
        acceptUIFormHeaderTxt: 'Pay To '+ 'mechknowsoft'
      };
      
  
      // if(this .storeSettings.paymentGateway=='Paypal')
      // {
        //this.loadPaypal(1)
      // this.payPalConfig = {
      //   currency: 'USD',
      //   clientId: 'AfcoO2j__fJKFtVjqzuyoeqgu8dd0hbnIzHLJjketLVqHd3HYxIZ5ui6qOsO4IgE8amMp5gmyoG41bEh',
      // }
   //   };
      // PaymentgatwayModel.authorizenetConfig = {
      //   billingAddressOptions: '{"show":true, "required":false}',
      //  urlAction: 'https://api.yourdomain.com/authorizepay/callback',
      //   apiLoginID: '6j7R4jLFcM',
      //   clientKey: '96BwZ6rwDHWCjSkxNebN49Pf7Ph8uY3D8ZtfS76JRkczGF9S74rzmmZtuHHMGpee',
      //   acceptUIFormBtnTxt: 'Pay Now',
      //   acceptUIFormHeaderTxt: 'Pay To My Account'
      // }
    //}
   // this.renderer = rendererFactory.createRenderer(null, null);
      // PaymentgatwayModel.authorizeDotnetbillingAddressOptions = '{"show":true, "required":false}';
      // PaymentgatwayModel.authorizeDotnetUrlAction = '{"show":true, "required":false}';
      // PaymentgatwayModel.authorizeDotnetApiLoginId = '5e7kLDcb82';
      // PaymentgatwayModel.authorizeDotnetClientKey = '3L9eF8sg6r9uEcrVhEwvU7DkTr4s653AG584DbG6z8LHh7mLmbBHYTsdt5MCAW4B';

    }

    ngOnInit() {
     // this.loadStripe()
     
    }
    storeSettings=
    {
        faxUserId:'',
        faxPassword:'',
        companyName:'',
        theamColorCode:'#ea0029',
        headerColorCode: '#000',
        headerimage: '../../assets/img/trending1.png',
        loginBackgroundImage:'../../assets/img/logo_web.png',
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
        addClover:'',
        cloverAccessToken:'',
        cloverAuthToken:'',
        cloverMerchantId:'',
        cloverEmployeeID:'',
        cloverTenderId:'',
        currency:'',
        transactionkey:'',
    };
  
    public static  paymentdisplay='block';
    loadPaymentGatway(orderdata)
    {
      debugger;
  
      PaymentgatwayModel.paymentdisplay='block';
      this.razorPay(orderdata)
     //this.stripePaygateway(orderdata);
     // this.loadPaypal(orderdata)

    //  working code after impelemnt setting
      // if(this.storeSettings.paymentGateway=='Paypal'){
      //   PaymentgatwayModel.paymentdisplay='block';
      //   this.loadPaypal(orderdata);
      // }else if(this.storeSettings.paymentGateway=='Authorize.net'){
      //   PaymentgatwayModel.paymentdisplay='block';
      //   this.loadAuthorizeDotnet()
      // }else if(this.storeSettings.paymentGateway=='Stripe'){
      //   PaymentgatwayModel.paymentdisplay='block';
      
      // }else if(this.storeSettings.paymentGateway=='RazorPay'){
      //   PaymentgatwayModel.paymentdisplay='block';
        
      //   this.razorPay(orderdata)
      // }else{

      // }
    
    }
   


    

   razorPay(lstofdata:any)
   {
    debugger;
    
    
    const options: any = {
      key: 'rzp_test_glA246D8rCFOVc',
      amount: (+lstofdata.orderTotal) * 100, // amount should be in paise format to display Rs 1255 without decimal point
      currency: 'INR',
      name: 'Black Denim Pvt Ltd..', // company name or product name
      description: 'shooping',  // product description
      image: '', // company logo or product image
      // order_id: val, // order_id created by you in backend
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      notes: {
        // include notes if any
      },
      theme: {
        color: '#0c238a'
      },
      handler: function (response){
       debugger;
        PaymentgatwayModel.pageComponent.Razorpaymentsuccess(response.razorpay_payment_id);
        
    }
    };
    debugger;
    
    
    var successCallback = function (payment_id:any) {
      debugger;
      
      PaymentgatwayModel.pageComponent.Razorpaymentsuccess(payment_id);
      
    };
    debugger;
  
    var cancelCallback = function (error:any) {
      debugger;
      console.error(error)

  //   alert('alert1');
    };
      
    const rzp = new this.winRef.nativeWindow.Razorpay(options, successCallback, cancelCallback);
    
      rzp.open();

      rzp.on('payment.failed', function (response){

        // console.log(response.error.code);
        // console.log(response.error.code)
    
        // console.log(response.error.description);
    
        // console.log(response.error.source);
    
        // console.log(response.error.step);
    
        // console.log(response.error.reason);
    
        // console.log(response.error.metadata.order_id);
    
        // console.log(response.error.metadata.payment_id);
    
    } )
      
     
   }
   
    loadStripe() 
    {
    
      if(!window.document.getElementById('stripe-script')) {
        const script = window.document.createElement("script");
        script.id = "stripe-script";
        script.type = "text/javascript";
        script.src = "https://checkout.stripe.com/checkout.js";
        script.onload = () => {
          this.paymentHandler = (<any>window).StripeCheckout.configure({
            key: 'pk_test_sLUqHXtqXOkwSdPosC8ZikQ800snMatYMb',
            locale: 'auto',
            token: function (stripeToken: any) {
              console.log(stripeToken)
              alert('Payment has been successfull!');
            }
          });
        }
        window.document.body.appendChild(script);
      }
    

    }
    DbResult:any = [];
    stripePaygateway(lstdata) {    
      debugger;
      const paymentHandler = (<any>window).StripeCheckout.configure({
        key: 'pk_test_sLUqHXtqXOkwSdPosC8ZikQ800snMatYMb',
        locale: 'auto',
        token: function (stripeToken: any) {
         //     // You can access the token ID with `token.id`.
        //     // Get the token ID to your server-side code for use.
        //     //  trigger event in checkout page 
       PaymentgatwayModel.pageComponent.stripepayment(stripeToken,lstdata)
        }
      });
    
      paymentHandler.open({
        name: 'BlackDenim',
        description: 'T-shirt round',
        amount: 200
      });
        // = (<any>window).StripeCheckout.configure({
         
        //   key: 'pk_test_TYooMQauvdEDq54NiTphI7jx',
        //   locale: 'auto',
        //   token: function (token: any) {
       
            
        //   }
        // });
        // debugger;
      
        // handler.open({
        //   name: 'BlackDenim',
        //   description: 'Online Order',
        //   amount: lstdata.orderTotal
        // });
        
    }

    
    sweetalert(){
      Swal.fire({
        icon: 'success',
        title: 'Thank you!...',
        text: 'Your order placed successfully!..',
        
      })
      this.router.navigateByUrl('orders')
    }
async loadAuthorizeDotnet()
{
  debugger;
  $('.AcceptUI').click();
//  / btn AcceptUI

}

payAuthorizeDotnetPayment(payData:any,amount:any)
{
  debugger;
  
  const data = {
    createTransactionRequest: {
      merchantAuthentication: {
        name: '',
        transactionKey:'57r3CX2hk626D8wk'
      },
      transactionRequest: {
        transactionType: 'authCaptureTransaction',
        amount: amount,
        payment: {
          opaqueData: payData
        }
      }
    }
};

return new Promise((resolve, reject) => {
  debugger;
  this.http.post('https://api.authorize.net/xml/v1/request.api', data)
    .subscribe(resp => {
      debugger;
      console.log(resp);
      PaymentgatwayModel.pageComponent.onPaymentSuccess(resp);

      resolve(resp);
    }, (err) => {
      reject(err);
    })
});
}






public authorizeHandler = (response: object) => {
  debugger;
  //this.responseHandler.emit(response)
}
PaymentReferenceID:string="";
paymentMode:string="";
  loadPaypal(lstorderdata)
{
  
  
  debugger;
   this.payPalConfig = {
    currency: 'USD',
    clientId: 'AfcoO2j__fJKFtVjqzuyoeqgu8dd0hbnIzHLJjketLVqHd3HYxIZ5ui6qOsO4IgE8amMp5gmyoG41bEh',
     createOrderOnClient: (data) => < ICreateOrderRequest > {
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'USD',
                value: '9.99',
                breakdown: {
                    item_total: {
                        currency_code: 'USD',
                        value: '9.99'
                    }
                }
            },
            items: [{
                name: 'Enterprise Subscription',
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                    currency_code: 'USD',
                    value: '9.99',
                },
            }]
        }]
    },
    advanced: {
        commit: 'true'
    },
    style: {
        label: 'paypal',
        layout: 'vertical'
    },
     onApprove: (data, actions) => {
      debugger;
      console.log(data);
      PaymentgatwayModel.pageComponent.PaypalPaymentsuccess(data);
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((x:any) => {
          console.log('paypal',x)
    });
    },
    onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
       // this.showSuccess = true;
    },
    onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        this.resetStatus('OnCancel')
       // this.showCancel = true;

    },
    onError: err => {
        console.log('OnError', err);
      //  this.showError = true;
    },
    onClick: (data, actions) => {
        console.log('onClick', data, actions);
      let type=data.fundingSource;

        this.resetStatus(type);
    }
};

  

}
    
resetStatus(type){
  debugger;
  if(type==='card'){
   $('.content').attr('style','margin-top:50rem;width: 153%;')
  }else{
    $('.content').attr('style','margin-top:13rem;')
  }

}

// method(){
//   debugger;
//   alert('payemnt')
// }





}



  