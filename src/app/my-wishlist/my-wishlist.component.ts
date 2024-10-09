import { Component, OnInit } from '@angular/core';
import { APICallingService } from '../model/APICallingService';
import { loginDetails } from '../UserDetails';
import { Store } from '@ngrx/store';
import { Cart, CartList } from '../Cart';
import * as PageStore from "src/app/Store/PageStore/Page.Actions";
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { MyWishList } from '../Mywishlist';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-my-wishlist',
  templateUrl: './my-wishlist.component.html',
  styleUrls: ['./my-wishlist.component.css']
})
export class MyWishlistComponent implements OnInit {
  loginUserDetails:any;
  DbResult:any=[];
  hideTable:boolean=true;
  MyWishlistProduct:any=[];
  ImageAppUrl:string="";
  constructor(private store:Store<any>,private APICALL:APICallingService ,private objCart:Cart,private objWish:MyWishList,public router:Router ) { 
    var lstImagepath = (this.store as any).source['value']['MSECOM'].filter((x: any) => { return x.viewName == "ImageUrl"; });
    this.ImageAppUrl=lstImagepath[0].ImageUrl;
  
  }

  ngOnInit(){
    debugger;
    this.loginUserDetails = new loginDetails();
    var result = (this.store as any).source['value']['MSECOM'].filter((x: any) => { return x.viewName == "loginDetails"; });
    
    if (result.length > 0) {
     
      this.loginUserDetails = (Object.assign({}, result[0]));
    }
    this.WishDetails()
    
  }

  WishDetails()
{
  debugger;
  let WishDetails = (this.store as any).source['value']['MSECOM'].filter((x:any) => {
    return x.viewName == 'Mywishlist';
  });
  if( WishDetails[0].WishlistDetails.length>0 ) {
    debugger;
    this.hideTable=false;
    for(let i of WishDetails[0].WishlistDetails){
      debugger
   //   i['Image1']=(this.ImageAppUrl+i['Image1'])
       i['ProductImage']=(this.ImageAppUrl+i['ProductImage'])
        }
        this.MyWishlistProduct=Object.assign([],  WishDetails[0].WishlistDetails);
   
  }else{

    this.GetWishListfromDb()
  }
}

  RemoveFromWishlist(d,Index){
   debugger;
   
    this.APICALL.DBCalling('DeleteWishList',d.IsWishListItem,'','','').subscribe(
      (res) => {
        this.DbResult= (Object.assign([],res));
        if(this.DbResult.tasks[0].length>0){
          debugger;
          this.MyWishlistProduct.splice(Index,1)
          this.objWish.GetWishlistCount(this.MyWishlistProduct)
          var len=this.MyWishlistProduct.length;
          if(len==0){
            this.hideTable=true;
          }else{
            this.hideTable=false;
          }
        }
      })
  }
  GetWishListfromDb(){
    debugger;
        this.APICALL.DBCalling('ViewWishListDetByUserID',this.loginUserDetails.UserID,'','','').subscribe(
            (res) => {
                debugger;
                this.DbResult= (Object.assign([],res)); 
                this.MyWishlistProduct=this.DbResult.tasks[0];
                var len=typeof(this.MyWishlistProduct.length)=='undefined' ? 0 :this.MyWishlistProduct.length;
                if( len>0){
                  this.hideTable=false;
                  for(let i of this.MyWishlistProduct){
                    debugger
                    i['Image1']=(this.ImageAppUrl+i['Image1'])
                     i['ProductImage']=(this.ImageAppUrl+i['ProductImage'])
                      }
                }else{
                  this.hideTable=true;
                }
               
            }
  )}

  BrowseProduct(){
    debugger;
    this.router.navigateByUrl('/home');
  }
  lstSetItemList:any=[];
  AddtoCartClick(Productlst)
  {
  debugger;
  var valid=true;
    try{
    valid=true;
    let  obj=new  CartList();
    obj.MerchantID=Productlst.MerchantID;
    obj.ProductName=Productlst.ProductName;
    obj.ProductCode=Productlst.ProductCode;
    obj.ProductLongDesc=Productlst.ProductLongDesc;
    obj.ProductImage=this.ImageAppUrl+Productlst.Image1;
    obj.Price=Productlst.Price;
    obj.SalesPrice=Productlst.SalesPrice;
     obj.ProductQty=Productlst.AvailableQty;
    obj.OPGName1=Productlst.OPGName1;
  obj.IsWishListItem=Productlst.IsWishListItem.toString();
    obj.OPGName2=Productlst.OPGName2;
    obj.OPGName3=Productlst.OPGName3;
    obj.OPGName4=Productlst.OPGName4;
    obj.ProductID=Productlst.ProductID;
    obj.ProductOptionID=Productlst.ProductOptionID;
    obj.OPName1=Productlst.OPName1;
    obj.OPName2=Productlst.OPName2;
    obj.OPName3=Productlst.OPName3;
    obj.OPName4=Productlst.OPName4;
    obj.ParentID='0';
    obj.Qty=1;
    obj.OPName3=Productlst.OPName3;
    obj.OPName4=Productlst.OPName4;
    obj.CalcTotal();
    this.lstSetItemList=[];
    
  this.objCart.AddToCart(obj);
  Swal.fire({
    title: "Product has been added to your cart",
    timer: 2000,
  });
  this.store.dispatch(new  PageStore.OpenPage({viewName:'CartList',lstCartList:this.objCart.lstCartList}));

    }catch(e){
      console.log(e)
    }
    
    
  }
        
  
}
