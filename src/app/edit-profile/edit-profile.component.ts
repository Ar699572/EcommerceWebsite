import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loginDetails } from '../UserDetails';
import * as PageStore from "src/app/Store/PageStore/Page.Actions";
import { Router } from '@angular/router';
import { APICallingService } from '../model/APICallingService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  constructor(private store:Store<any>,private router:Router,private apiCall:APICallingService,) { }

  ngOnInit(): void {
    debugger;
    this.loginUserDetails= new loginDetails();
    var result = (this.store as any).source['value']['MSECOM'].filter((x:any) => { return x.viewName == "loginDetails"; });
    if (result.length > 0) {
      this.loginUserDetails=( Object.assign({},result[0] ));
    }
    this.viewAddress();
  }

  loginUserDetails:any;
  submited = false;
  submitted = false;
  id:number=0;
  country:string="";
  state:string="";
  city:string="";
  pin:any="";
  address:string="";
  AddressType:string="";
  isdefaultaddress:any = 0;
  lstAddressDetails:any=[];
  dbResult:any=[];
  addressmodaldisplay = 'none';

  // logoutClick(){
  //   debugger;
  //   let loginUserDetails=new loginDetails;
  //   this.loginUserDetails.viewName="UserDetails";
  //   this.store.dispatch(new  PageStore.OpenPage(loginUserDetails));
  //   this.router.navigateByUrl('/userlogin');
  // }

  cancelClick(){
    debugger;
    this.router.navigateByUrl('/home');
  }

  validateEmail(input:any):boolean {
    var regexp=new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    var res= regexp.test(input)
    return res;
    }

    validateMobile(input:any):boolean {
      var regexp=new RegExp(/^[6-9]\d{9}$/);
      var res= regexp.test(input)
      return res;
      }

  validateProfile():any{
    var validate=true;
    var valEmail=this.validateEmail(this.loginUserDetails.UserEmail);
  if((this.loginUserDetails.UserEmail==''|| (valEmail!=true))&& validate){
  validate =false;
  }
  if(this.loginUserDetails.UserFirstName=='' && validate)
  {
  validate =false;
  }
  if(this.loginUserDetails.UserLastName=='' && validate)
  {
  validate =false;
  }
  if(this.loginUserDetails.UserMobile=='' && validate)
  {
  validate =false;
  }
  var valPhone=this.validateMobile(this.loginUserDetails.UserMobile);
  if((this.loginUserDetails.UserMobile==''|| (valPhone!=true))&& validate)
  {
  validate =false;
  }
  if(this.loginUserDetails.UserPassword=='' && validate)
  {
  validate =false;
  }
  if(this.loginUserDetails.UserCountry=='' && validate)
  {
  validate =false;
  }
  if(this.loginUserDetails.UserState=='' && validate)
  {
  validate =false;
  }
  if(this.loginUserDetails.UserCity=='' && validate)
  {
  validate =false;
  }
  if(this.loginUserDetails.UserZip=='' && validate)
  {
  validate =false;
  }
  if(this.loginUserDetails.UserAddress=='' && validate)
  {
  validate =false;
  }
  return validate;
  }

  saveDetails(){
    this.submited = true;
    if(this.validateProfile() && this.loginUserDetails.UserID > 0){
      var xml1='<NewDataSet><Table1>'
    +'<UserID>'+this.loginUserDetails.UserID+'</UserID>'
    +'<UserFirstName>'+this.loginUserDetails.UserFirstName+'</UserFirstName>'
    +'<UserLastName>'+this.loginUserDetails.UserLastName+'</UserLastName>'
    +'<UserEmail>'+this.loginUserDetails.UserEmail+'</UserEmail>'
    +'<UserMobile>'+this.loginUserDetails.UserMobile+'</UserMobile>'
    +'<UserPassword>'+this.loginUserDetails.UserPassword+'</UserPassword>'
    +'<UserCountry>'+this.loginUserDetails.UserCountry+'</UserCountry>'
    +'<UserState>'+this.loginUserDetails.UserState+'</UserState>'
    +'<UserCity>'+this.loginUserDetails.UserCity+'</UserCity>'
    +'<UserZip>'+this.loginUserDetails.UserZip+'</UserZip>'
    +'<UserAddress>'+this.loginUserDetails.UserAddress+'</UserAddress>'
    +'</Table1></NewDataSet>';
    debugger;
    this.apiCall.DBCalling("SaveRegistaration",xml1,"","","").subscribe(
      async (res) => {
        debugger;
        let brnadResult:any= (res);
          let i=0;
        if(brnadResult.tasks[i][0].DBresult=='1' )
        {
          this.store.dispatch(new  PageStore.OpenPage(this.loginUserDetails));
          Swal.fire({
            position: 'center',
            icon: 'success',
            text:'Profile Updated successfully !'
          });
        }else{
          Swal.fire({
            position: 'center',
            icon: 'error',
            text:'Something went wrong!'
          });
         }
      });
    }
  }

  isDefaultAddressCheck(event) {
    debugger;
    if (event == true) {
      this.isdefaultaddress = 1;
    } else {
      this.isdefaultaddress = 0;
    }
  }

  validateAddress():any{
    var validate=true;
  
  if(this.country=='' && validate)
  {
  validate =false;
  }
  if(this.state=='' && validate)
  {
  validate =false;
  }
  if(this.city=='' && validate)
  {
  validate =false;
  }
  if(this.pin=='' && validate)
  {
  validate =false;
  }
  if(this.address=='' && validate)
  {
  validate =false;
  }
  return validate;
  }

  saveAddress(){
    debugger;
    this.submitted = true;
    if(this.validateAddress()){
      if(this.AddressType == ''){
        this.AddressType = 'Home'
      }
      if(this.isdefaultaddress == 1){
        this.isdefaultaddress = 'on'
      }else{
        this.isdefaultaddress = 'off'
      }
      var xml1='<NewDataSet><Table1>'
    +'<ID>'+this.id+'</ID>'
    +'<Country>'+this.country+'</Country>'
    +'<State>'+this.state+'</State>'
    +'<City>'+this.city+'</City>'
    +'<PinCode>'+this.pin+'</PinCode>'
    +'<Address>'+this.address+'</Address>'
    +'<AddressType>'+this.AddressType+'</AddressType>'
    +'<IsdefaultAddress>'+this.isdefaultaddress+'</IsdefaultAddress>'
    +'<UserID>'+this.loginUserDetails.UserID+'</UserID>'
    +'</Table1></NewDataSet>';
    debugger;
    this.apiCall.DBCalling("SaveUserAddress",xml1,"","","").subscribe(
      async (res) => {
        debugger;
        let addressDet:any= (res);
          let i=0;
        if(addressDet.tasks[i][0].DBresult > 0)
        {
          Swal.fire({
            position: 'center',
            icon: 'success',
            text:'Address Saved Successfully !'
          });
          this.viewAddress();
          this.closeAddressModal();
        }else{
          Swal.fire({
            position: 'center',
            icon: 'error',
            text:'Something went wrong !'
          });
         }
         if(addressDet.tasks[i][0].UpdatedDBresult > 0)
         {
           Swal.fire({
             position: 'center',
             icon: 'success',
             text:'Address Updated Successfully !'
           });
           this.viewAddress();
           this.closeAddressModal();
         }
      });
    }
  }

  openAddress(){
    debugger;
    this.id=0;
    this.country="";
    this.state="";
    this.city="";
    this.pin="";
    this.address="";
    this.AddressType = "";
    this.isdefaultaddress = 0;
    this.submitted = false;
    this.addressmodaldisplay = 'block';
  }

  editAddress(data:any){
    debugger;
    this.id = data.ID;
    this.addressmodaldisplay = 'block';
    this.country = data.Country;
    this.state = data.State;
    this.city = data.City;
    this.pin = (+data.PinCode);
    this.address = data.Address;
    this.AddressType = data.AddressType;
    if(data.IsdefaultAddress == 'off'){
      this.isdefaultaddress = 0;
    }else{
      this.isdefaultaddress = 1;
    }
  }

  closeAddressModal(){
    debugger;
    this.addressmodaldisplay = 'none';
  }

  viewAddress(){
    debugger;
    this.apiCall.DBCalling("UserAddressesUserID",this.loginUserDetails.UserID,"","","").subscribe(
      async (res) => {
        debugger;
        let lstAddress:any= (res);
        this.lstAddressDetails = lstAddress.tasks[0];
      });
  }

  deleteAddressAlert(e:any){
    debugger;
   try {
      debugger;
      Swal.fire({
        title: 'Are you sure',
        text: 'Do you want to delete',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          debugger;
          this.deleteAddress(e);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelled',
            'your record is safe',
            'error'
          )};
      });
    }
  catch (e) { }
  }

  deleteAddress(e){
    debugger;
      this.apiCall.DBCalling("DeleteUserAddresses",e.ID,"","","").subscribe(
      async (res) => {
        debugger;
        this.dbResult= (res);
        if(this.dbResult.tasks[0][0].DBresult>0){
          Swal.fire({
            position: 'center',
            icon: 'success',
            text:'Address removed successfully'
          });
          this.viewAddress();
        }
      });
  }
}