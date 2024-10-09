import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams,HttpHeaders } from '@angular/common/http';
import { Store } from "@ngrx/store";
import { AppSettings, IAppSettings } from './AppSettings';
import * as AppLoadingSettings from '../Store/Appsettings/AppLoadingSettings';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})




export class APICallingService {

  constructor(private http: HttpClient,private store: Store<any>,public appSettings:AppSettings) { 




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


DBCallingURL= this.storeSettings.apiCallingUrl+'ValuePass.php';

  // Email(Name: any,Email: any,Subject: any,Message: any,companyName:any,faxUserId:any,faxPassword:any,faxNumber:any)
  // {
  //   this.storeSettings=   this.appSettings.loadSettings();
   
      
  //   var URL=this.storeSettings.apiCallingUrl+'Email.php';
  //    return this.http.post(URL,JSON.stringify( {Name:Name,Email:Email,Subject:Subject,Message:Message,CompanyName:companyName,FaxUserId:faxUserId,FaxPassword:faxPassword,FaxNumber:faxNumber}),httpOptions);
  // }

  SendEmail(UserName: any,UserEmail: any,Subject: any,orderLst: any){
debugger;
    var URL='https://mechknowsamplework.com/rugsancuisine.com/WebAPI/WebAPI/ApplicationLevelScripts/BlackDenimEmail.php';
    return this.http.post(URL,JSON.stringify( {Name:UserName,Email:UserEmail,Subject:Subject,orderLst:orderLst}),httpOptions);
  }
  
  headers = new HttpHeaders();
  SaveImage(formData: any,filetype: any)
  {
    this.storeSettings=   this.appSettings.loadSettings();
    this.headers=new HttpHeaders();
      this.headers.set('Content-Type', 'application/octet-stream');
      this.headers.set('Upload-Content-Type', filetype)
      
  
    var URL=this.storeSettings.apiCallingUrl+'upload1.php';
    return this.http.post(URL, formData, {
      headers: this.headers
    }
    );
  
  }


  
    DBCalling(Operation: any,xml: any,Xml2: any,Xml3: any,Xml4: any){

     this.storeSettings=this.appSettings.loadSettings();
   
  
      var URL=this.storeSettings.apiCallingUrl+'ValuePass.php';
      if(xml==undefined){
        xml='';
      }
      
       return this.http.post(URL, {Operation:Operation,Params:xml.toString(),Xml2:Xml2,Xml3:Xml3,Xml4:Xml4},httpOptions);
       
        }
  
  
     GetApplicationSettings(domainName:any)
     {

    //  alert(domainName);
      this.storeSettings=   this.appSettings.loadSettings();
      domainName=domainName=='localhost'?'mechknowsoft.com':domainName;
      
      var URL=AppLoadingSettings.APIPath+'/API/MSPBSAdmin/getDeveloperSettings';
      
    
       return this.http.post(URL, {domainName:domainName},httpOptions);


     }
     
  }
  
