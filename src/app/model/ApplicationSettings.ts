import { APICallingService } from "./APICallingService";
import * as PageStore from "src/app/Store/PageStore/Page.Actions";
import * as AppLoadingSettings from '../Store/Appsettings/AppLoadingSettings';
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";
import * as $ from 'jquery';
@Injectable({
    providedIn: 'root',
  })
  
  export class ApplicationSettings {

    constructor(private apiCall:APICallingService,private store: Store<any>,public router:Router)
    {
     
    }
    extractDomain(url:any) {
        var domain;
        //find & remove protocol (http, ftp, etc.) and get domain
        if (url.indexOf("://") > -1) {
          domain = url.split('/')[2];
        }
        else {
          domain = url.split('/')[0];
        }
        
        //find & remove www
        if (domain.indexOf("www.") > -1) { 
          domain = domain.split('www.')[1];
        }
        
        domain = domain.split(':')[0]; //find & remove port number
        domain = domain.split('?')[0]; //find & remove url params
      
        return domain;
      }
      getSettings()
      
      { 
        $("#preloader").show(); 
        return new Promise((resolve, reject) => {
        debugger;
  
        var url = (window.location != window.parent.location)
        ? document.referrer
        : document.location.href;
  //alert(url);
        let res=  window.location.href.split('/#/');
  
  
       // var url = window.location.href;
      //  var arr = url.split("/");
      //  var result = arr[0] + "//" + arr[2];
      if(res.length>0)
      {
      if(res[1]=='home' || res[1]==''  || res[1]=='login'   )
      {
        try{
        this.apiCall.GetApplicationSettings(this.extractDomain(url)).subscribe(
          (res:any) => 
          {
           debugger;
            if(res.objCompanySettingsdomain.length>0 )
            {
         //   this.storeSettings=   this.loadSettings();
        
         
  let selectedBranch={};
    let storeselectedBranchSettings = (this.store as any).source['value']['MSECOM'].filter((x:any) => {
              return x.viewName == 'selectedBranch';
            });
            if( storeselectedBranchSettings.length > 0) {
              selectedBranch=Object.assign({},  storeselectedBranchSettings[0].selectedBranch);
  
            }
            let storeSettings=Object.assign({}, res.objCompanySettingsdomain[0])
        
            storeSettings.logo= AppLoadingSettings.DocumentPath+storeSettings.logo;
            storeSettings.headerimage= AppLoadingSettings.DocumentPath+storeSettings.headerimage;
            storeSettings.loginBackgroundImage= AppLoadingSettings.DocumentPath+storeSettings.loginBackgroundImage;
            storeSettings.loginImage= AppLoadingSettings.DocumentPath+storeSettings.loginImage;
            storeSettings.selectedBranch=selectedBranch;
            storeSettings.viewName="AppSettings";
            this.store.dispatch(new  PageStore.OpenPage(storeSettings));
            $("#preloader").hide();
            resolve(true);
            }
            else{
            //resolve(true);
                
              this.router.navigateByUrl("/pagenotfound");
            }
          });
        }catch(e)
        {
          this.router.navigateByUrl("/pagenotfound");
          debugger;
        }
        }
        else{
          resolve(true);
        }
      }else{
        this.router.navigateByUrl("/pagenotfound");
      }
    });
    }
}