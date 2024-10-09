import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { APICallingService } from '../model/APICallingService';
import * as PageStore from "src/app/Store/PageStore/Page.Actions";
import { AppSettings } from '../model/AppSettings';
import { IRegistration } from '../Registration';
import { loginDetails } from '../UserDetails';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {

  constructor(private apiCall:APICallingService,private store: Store<any>,public router:Router,public appSettings:AppSettings) { }

  registration:IRegistration={
    UserFirstName:'',
    UserLastName:'',
    UserCountry:'',
    UserState:'',
    UserCity:'',
    UserAddress:'',
    UserZip:'',
    UserEmail:'',
    UserMobile:'',
    UserPassword:'',
  }

  loginUserDetails:any;
  submited = false;

  ngOnInit(): void {
    debugger;
    this.loginUserDetails = new  loginDetails();
    var result = (this.store as any).source['value']['MSECOM'].filter((x:any) => { return x.viewName == "loginDetails"; });
    if (result.length > 0) {
     this.loginUserDetails=( Object.assign({},result[0] ));
    }
  }

  validateMobile(input:any):boolean
  {
  var regexp=new RegExp(/^[6-9]\d{9}$/);
    var res= regexp.test(input)
   return res;
  }

  validateEmail(input:any):boolean
  {
  var regexp=new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    var res= regexp.test(input);
   return res;
  }

  validateUserRegistration():boolean
  {
    debugger;
    var validate=true;

    if(this.registration.UserFirstName=='')
    {
    validate =false;
    }

    if(this.registration.UserLastName=='' && validate)
    {
    validate =false;
    }

    if(this.registration.UserAddress=='' && validate)
    {
    validate =false;
    }

    if(this.registration.UserZip=='' && validate)
    {
    validate =false;
    }

    var valEmail=this.validateEmail(this.registration.UserEmail);

    if((this.registration.UserEmail==''|| (valEmail!=true))&& validate)
    {
    validate =false;
    }

    if(this.registration.UserMobile=='' && validate)
    {
    validate =false;
    }

    var valPhone = this.validateMobile(this.registration.UserMobile);
    if((this.registration.UserMobile==''|| (valPhone!=true))&& validate)
    {
    validate =false;
    }

    if(this.registration.UserPassword=='' && validate)
    {
    validate =false;
    }

    if(this.registration.UserCountry=='' && validate)
    {
    validate =false;
    }

    if(this.registration.UserState=='' && validate)
    {
    validate =false;
    }

    if(this.registration.UserCity=='' && validate)
    {
    validate =false;
    }

    return  validate;
  }


  saveUserDetails()
  {
    debugger;
    this.submited = true;
    if(this.validateUserRegistration()){
    var xml1='<NewDataSet><Table1>'
    +'<UserID>'+this.loginUserDetails.UserID+'</UserID>'
    +'<UserFirstName>'+this.registration.UserFirstName+'</UserFirstName>'
    +'<UserLastName>'+this.registration.UserLastName+'</UserLastName>'
    +'<UserEmail>'+this.registration.UserEmail+'</UserEmail>'
    +'<UserMobile>'+this.registration.UserMobile+'</UserMobile>'
    +'<UserPassword>'+this.registration.UserPassword+'</UserPassword>'
    +'<UserCountry>'+this.registration.UserCountry+'</UserCountry>'
    +'<UserState>'+this.registration.UserState+'</UserState>'
    +'<UserCity>'+this.registration.UserCity+'</UserCity>'
    +'<UserZip>'+this.registration.UserZip+'</UserZip>'
    +'<UserAddress>'+this.registration.UserAddress+'</UserAddress>'
    +'</Table1></NewDataSet>';
    debugger;
    this.apiCall.DBCalling("SaveRegistaration",xml1,"","","").subscribe(
      async (res) => {
        debugger;
        let brnadResult:any= (res);
        if(brnadResult.tasks.length>0 ){
          let i=0;
        if(brnadResult.tasks[i][0].dbResult=='-3' )
        {
          Swal.fire({
            position: 'center',
            icon: 'warning',
            text:'User Already Exists.Please Login and Continue !'
          });
        }else{
          this.loginUserDetails=new loginDetails();
          this.loginUserDetails.UserID=brnadResult.tasks[i][0].UserID;
          this.loginUserDetails.UserEmail=this.registration.UserEmail;
          this.loginUserDetails.UserFirstName=this.registration.UserFirstName;
          this.loginUserDetails.UserLastName=this.registration.UserLastName;
          this.loginUserDetails.UserCity=this.registration.UserCity;
          this.loginUserDetails.UserState=this.registration.UserState;
          this.loginUserDetails.UserZip=this.registration.UserZip;
          this.loginUserDetails.UserCountry=this.registration.UserCountry;
          this.loginUserDetails.UserAddress=this.registration.UserAddress;
          this.loginUserDetails.UserMobile=this.registration.UserMobile;
          this.store.dispatch(new  PageStore.OpenPage(this.loginUserDetails));
                
          this.router.navigate(['/home']);
         }
        }else{
        Swal.fire({
          position: 'center',
          icon: 'error',
          text:'failed.! Contact System Admin'
        }); 
      }
      });
    }
  }

  loginClick(){
    this.router.navigateByUrl('/userlogin');
  }

}
