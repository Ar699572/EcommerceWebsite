import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
// import { url } from "inspector";
import * as $ from 'jquery';

@Injectable({
    providedIn: 'root',
  })
  export class AppSettings {


    constructor(private store: Store<any>)
    {

    }
    storeSettings:IAppSettings=
    {
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
        selectedBranch:'{}',
        apiLoginId:'',
        orderEmail:'',
        adminUrl:'',
        orderUrl:'',
        viewName:'AppSettings',
         //  test api url 
   apiCallingUrl:'http://207.180.234.202/~mcksmple/e-commerce.com/E-commerceWebAPI/ApplicationLevelScripts/',
      //  live api url 
   // apiCallingUrl:'https://blackdenim.in/E-commerceWebAPI/ApplicationLevelScripts/',
        // previious url
        // apiCallingUrl:'http://mechknowsamplework.com/e-commerce.com/TestingE-commerceWebAPI/ApplicationLevelScripts/',
        fontFamily:'prompt,sans-serif',
        domainName:'',
        fax:'',

        projectId:'',
        keyNo:'',
        noOfBranches:0,
        
        currency:'₹',
        transactionkey:'',
        faxUserId:'',
        faxPassword:'',
    };
    
 public   loadSettings():any
    {
        let storeSettings = (this.store as any).source['value']['MSECOM'].filter((x:any) => {
            return x.viewName == 'AppSettings';
          });
          if( storeSettings.length > 0) {
            this.storeSettings=Object.assign({},  storeSettings[0]);
          }
this.applySettings();
return this.storeSettings;
    }

    applySettings()
    {
      $('body').attr('style', 'font-family: '+this.storeSettings.fontFamily+' !important;font-size: 13px;color: #000;');

      $('.offer-section').attr('style', 'background-color: '+this.storeSettings.headerColorCode+' !important');
      
      $('.bg-primary-style2').attr('style', 'background-color: '+this.storeSettings.theamColorCode+' !important');
      
      $('.bg-primary').attr('style', 'background-color: '+this.storeSettings.theamColorCode+' !important');
      
      $('.bg-primary').attr('style', 'background: '+this.storeSettings.theamColorCode+' !important');
      
      $('.primary-dark').attr('style', 'background-color: '+this.storeSettings.theamColorCode+' !important');
      
      $('.btn-primary').attr('style', 'background: '+this.storeSettings.theamColorCode+' !important;border-color:'+this.storeSettings.theamColorCode+' !important');
      
      $('.btn-success').attr('style', 'background-color: '+this.storeSettings.successColorCode+' !important;border-color:'+this.storeSettings.successColorCode+' !important');
      
      $('.badge-danger').attr('style', 'background: '+this.storeSettings.dangerColorCode+' !important;border-color:'+this.storeSettings.dangerColorCode+' !important');
      
      $('.badge-success').attr('style', 'background-color: '+this.storeSettings.successColorCode+' !important;border-color:'+this.storeSettings.successColorCode+' !important');
      
      $("#imgLogo").attr("src", this.storeSettings.logo);
      
      $("#imgeHeader").attr("src", this.storeSettings.headerimage);

      $("#imgLoginBg").attr('style', 'background-image:'+'linear-gradient(rgb(0 0 0 / 63%), rgb(0 0 0 / 29%)),'+' '+'url'+'('+this.storeSettings.loginBackgroundImage+')');
      $("#imgregistration").attr('src',this.storeSettings.loginBackgroundImage);

      $("#imgLogin").attr("src", this.storeSettings.loginImage);
    }
}






export interface IAppSettings {
    theamColorCode:string;
    headerColorCode: string;
    logo: string;
    paymentGateway:string;
    key:string;
    companyName:string;
    selectedBranch:any;
    apiLoginId:string;
    orderEmail:string;
    adminUrl:string;
    orderUrl:string;
    viewName:string;
    fontFamily:string;
    dangerColorCode:string;
    successColorCode: string;
    headerimage: string;
    loginBackgroundImage:string;
    loginImage:string;
    apiCallingUrl:string;
    domainName:string;
    fax:string;
    projectId:string;
    keyNo:string;
    noOfBranches:number;
    
    currency:string;
    transactionkey:string;
    faxUserId:string;
    faxPassword:string;
 } 