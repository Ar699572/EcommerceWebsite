import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { APICallingService } from '../model/APICallingService';
import { loginDetails } from '../UserDetails';
import * as PageStore from "src/app/Store/PageStore/Page.Actions";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  constructor(private apiCall:APICallingService,private router:Router,private store: Store<any>,) { 
    debugger;
    this.loginUserDetails= new loginDetails();
    var result = (this.store as any).source['value']['MSECOM'].filter((x:any) => { return x.viewName == "loginDetails"; });
    if (result.length > 0) {
      this.loginUserDetails=( Object.assign({},result[0] ));
    }
    if(this.loginUserDetails.UserID > 0){
      debugger;
      this.router.navigateByUrl('/home');
    }else{
      this.router.navigateByUrl('/userlogin');
    }
  }

  ngOnInit(): void {
  }

  email:any='';
  password:any='';
  submited=false;
  dbResult:any;
  loginUserDetails:any;

  validateLogin():any
  {
    var validate=true;
    var valEmail=this.validateEmail(this.email);
  if((this.email==''|| (valEmail!=true))&& validate)
    {
      validate =false;
    }

  if(this.password=='' && validate)
    {
    validate =false;
    }

    return validate;
  }

  validateEmail(input:any):boolean
  {
      var regexp=new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      var res= regexp.test(input)
      return res;
  }

  Login()
{
  debugger;
  this.submited = true;
  if(this.validateLogin()){
  this.loginUserDetails = new  loginDetails();
  var result = (this.store as any).source['value']['MSECOM'].filter((x:any) => { return x.viewName == "loginDetails"; });
  if (result.length > 0) {
   this.loginUserDetails=( Object.assign({},result[0] ));
  }
  this.loginUserDetails=new loginDetails();

  if(this.email!="" &&  this.password!="")
  {
    debugger;
    this.apiCall.DBCalling("UserLogin",this.email,this.password,"","").subscribe(
      (res:any) => 
      {
       debugger;
       this.dbResult= (res);
       if(this.dbResult.tasks.length>0 )
       {
         let i=0;
        this.loginUserDetails.UserID=(+this.dbResult.tasks[i][0].UserID);
        this.loginUserDetails.UserEmail=this.dbResult.tasks[i][0].UserEmail;
        this.loginUserDetails.UserFirstName=this.dbResult.tasks[i][0].UserFirstName;
        this.loginUserDetails.UserLastName=this.dbResult.tasks[i][0].UserLastName;
        this.loginUserDetails.UserCity=this.dbResult.tasks[i][0].UserCity;
        this.loginUserDetails.UserState=this.dbResult.tasks[i][0].UserState;
        this.loginUserDetails.UserCountry=this.dbResult.tasks[i][0].UserCountry;
        this.loginUserDetails.UserZip=this.dbResult.tasks[i][0].UserZip;
        this.loginUserDetails.UserAddress=this.dbResult.tasks[i][0].UserAddress;
        this.loginUserDetails.UserPassword=this.dbResult.tasks[i][0].UserPassword;
        this.loginUserDetails.UserMobile=this.dbResult.tasks[i][0].UserMobile;
        this.loginUserDetails.viewName="loginDetails";
        this.store.dispatch(new  PageStore.OpenPage(Object.assign({},this.loginUserDetails)));
        this.router.navigateByUrl('/home')
        .then(() => {
          window.location.reload();
        });
       }else{
        Swal.fire({
          position: 'center',
          icon: 'error',
          text:'Invalid Details'
        });
       }
       });
    }
  }
}

}
