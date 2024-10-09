import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { loginDetails } from '../UserDetails';
import { Cart, CartList } from '../Cart';
import { APICallingService } from '../model/APICallingService';
import { AppSettings, IAppSettings } from '../model/AppSettings';
import * as PageStore from "src/app/Store/PageStore/Page.Actions";
import { AppComponent } from '../app.component';
import { MyWishList } from '../Mywishlist';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation ,NgxGalleryLayout,NgxGalleryImageSize} from 'ngx-gallery-9';
import Swal from 'sweetalert2';
import { CheckoutComponent } from '../checkout/checkout.component';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailsComponent implements OnInit {
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

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
     
      currency:'₹',
      transactionkey:'',
  };
  ImagePath:string;
  constructor(private route: ActivatedRoute,private apiCall:APICallingService,private WishList:MyWishList,private App:AppComponent,private objCart:Cart,private store: Store<any>,public router:Router,public appSettings:AppSettings) { 
    this.storeSettings=   this.appSettings.loadSettings();
    this.ImagePath=this.storeSettings.apiCallingUrl;
   
let storeDeliverySettings = (this.store as any).source['value']['MSECOM'].filter((x:any) => {
  return x.viewName == 'deliveryZipCode';
});
if( storeDeliverySettings.length > 0) {
  let deliveryZipCode=Object.assign({},  storeDeliverySettings[0]);
$('#selectedZipCode').val(deliveryZipCode.deliveryZipCode);

let cartDetails = (this.store as any).source['value']['MSECOM'].filter((x:any) => {
  return x.viewName == 'CartList';
});
if( cartDetails.length > 0) {
  let lstCartList=Object.assign([],  cartDetails[0].lstCartList);
  this.objCart.CalcTotals(lstCartList);
}


this.checkDeliveryAvailability((+this.objCart.OrderGrossAmount));
}
  }
 

  getcurrency(){

    return this.storeSettings.currency;
  }
  sizepopdisplay='none';
  ImageClick(Image)
{


  this.Imagesrc=Image;

}
closeLoginModal(){
  this.sizepopdisplay='none';

}
sizeView(description){
  

  this.sizepopdisplay='block';
  this.SizeChartDescription=description;
}
loginUserDetails:any=[];
RawImagePath="";
DeliveryError:string="";
  Imagesrc="";
  ngOnInit(): void {
    $(document).ready(function() {
      window.scrollTo(0,0);
    });
   

    this.route.queryParamMap
    .subscribe((params:any) => {
      
    debugger;

     this.DProductID= params.params.ID;
     this.DOptionID= params.params.OptionID;
     this.RawImagePath=params.params.Img;
     this.SelectedOption2=params.params.option2;
     this.SelectedOption3=params.params.option3;
     this.getProductOptionDetailsByProductID();
     this.loginUserDetails = new loginDetails();
     var result = (this.store as any).source['value']['MSECOM'].filter((x: any) => { return x.viewName == "loginDetails"; });
     if (result.length > 0) {
       $('#preloader').hide();
       this.loginUserDetails = (Object.assign({}, result[0]));
     }
      //this.orderObj = { ...params.keys, ...params };
    }
  );
  this.galleryOptions = [
    {
      width: "497px",
      height: "862px",
      previewCloseOnClick:true,
      previewCloseOnEsc:true,
      thumbnailsColumns: 5,
       previewZoom: true, 
       previewRotate: true ,
       fullWidth :false,
      arrowPrevIcon: 'fa fa-chevron-left',
      arrowNextIcon: 'fa fa-chevron-right',
      closeIcon: "fa fa-window-close",
      fullscreenIcon:"fa fa-arrows",
     spinnerIcon: "fa fa-refresh fa-spin fa-3x fa-fw",
      previewFullscreen: true ,
      thumbnailSize:NgxGalleryImageSize.Cover,
      imageAutoPlayInterval:3000,
      layout :NgxGalleryLayout.ThumbnailsBottom,
      // auto play section
    imageAutoPlay: true, 
    imageAutoPlayPauseOnHover: true,
     previewAutoPlay: false,
      previewAutoPlayPauseOnHover: false ,
      // auto play section ends
      imageAnimation: NgxGalleryAnimation.Slide,
      imageSwipe: false,
      imageSize:NgxGalleryImageSize.Contain,
      thumbnailsMoveSize:0
    },
  
    // max-width 800
    {
      breakpoint: 800,
      width: '100%',
      height: '600px',
      imagePercent: 80,
      thumbnailsPercent: 20,
      previewFullscreen: true ,
      thumbnailsMargin: 20,
      thumbnailMargin: 20,
      imageSwipe: true,
      
    },
  
    // max-width 400
    {
      breakpoint: 400,
      preview: true,
      previewFullscreen: true ,
      imageSwipe: true
    },
   
   
    { "breakpoint": 500, "width": "300px", "height": "600px",  "previewFullscreen": true , "thumbnailsColumns": 3 },
    { "breakpoint": 300, "width": "100%", "height": "600px", "previewFullscreen": true ,"thumbnailsColumns": 2 }
    
  ];


  this.galleryImages = [  ];
    

  
  }
  hover=false;
  zindexval:string='-1';
  click(event){
    debugger;
   

  }

  
 
  lstProducts=[];
  lstRelatedProducts=[];
  IsWishListItem=[];
  lstset:any=[];
lstOp2 :any=[];
lstOp3 :any=[];
lstOp4 :any=[];
  MerchantID='0';

  SelectedOption1='';
  SelectedOption2='';
  SelectedOption3='';
  SelectedOption4='';
  DOptionID='0';
  DProductID='0';
  lstCurrentDet:any;

  CheckOptionB(lstData):[]
  {
    
    var  lstFilterDet:any=[];
 if(lstData!=null && typeof(lstData)!="undefined")
 {
   
 
   for(let j=0;j<this.lstProducts.length;j++)
   {
 
     if(this.lstProducts[j].OPName1==this.SelectedOption1)
     {
    for(var i=0;i<lstData.length;i++)
    {
    
      if(lstData[i].OptionName== this.lstProducts[j].OPName2 && lstData[i].SalesPrice==this.lstProducts[j].SalesPrice  )
      {
        if(lstFilterDet.length>0)
        {
          lstFilterDet.push(lstData[i]);
        }else{
          lstFilterDet=[lstData[i]];
        }
  
      }
    }
   }
   }
 }
 
    return  lstFilterDet;
  }
  
 
 
  CheckOptionC(lstData):[]
  {
    
    
   var  lstFilterDet:any=[];
  
 if(lstData!=null && typeof(lstData)!="undefined")
 {
   
   for(let j=0;j<this.lstProducts.length;j++)
   {
 
     if(this.lstProducts[j].OPName1==this.SelectedOption1 && this.lstProducts[j].OPName2==this.SelectedOption2  )
     {
    for(var i=0;i<lstData.length;i++)
    {
    
      if(lstData[i].OptionName== this.lstProducts[j].OPName3 && lstData[i].SalesPrice==this.lstProducts[j].SalesPrice)
      {
        if(lstFilterDet.length>0)
        {
          lstFilterDet.push(lstData[i]);
        }else{
          lstFilterDet=[lstData[i]];
        }
  
      }
    }
   }
   }
 }
 
    return  lstFilterDet;
  }
  
 
 
 
 
  CheckOptionD(lstData):[]
  {
    
   var  lstFilterDet:any=[];
  
   try{
    
    
  
 if(lstData!=null && typeof(lstData)!="undefined")
 {
   
   for(let j=0;j<this.lstProducts.length;j++)
   {
 
     if(this.lstProducts[j].OPName1==this.SelectedOption1 && this.lstProducts[j].OPName2==this.SelectedOption2 && this.lstProducts[j].OPName3==this.SelectedOption3  )
     {
    for(var i=0;i<lstData.length;i++)
    {
    
      if(lstData[i].OptionName== this.lstProducts[j].OPName4 && lstData[i].SalesPrice==this.lstProducts[j].SalesPrice )
      {
        if(lstFilterDet.length>0)
        {
          lstFilterDet.push(lstData[i]);
        }else{
          lstFilterDet=[lstData[i]];
        }
  
      }
    }
   }
   }
  
 }
 
 }catch(e)
 {
 
 }
    return  lstFilterDet;
  }


  CheckOption2(lstData,SValue):[]
  {
    

   var  lstFilterDet:any=[];
    for(var i=0;i<lstData.length;i++)
    {
    
      if(lstData[i].OPName2== SValue)
      {
        if(lstFilterDet.length>0)
        {
          lstFilterDet.push(lstData[i]);
        }else{
          lstFilterDet=[lstData[i]];
        }
  
      }
    }
  
    return  lstFilterDet;
  }
  
  
  
  CheckOption3(lstData,SValue):[]
  {
    
   var  lstFilterDet:any=[];
    for(var i=0;i<lstData.length;i++)
    {
    
      if(lstData[i].OPName3== SValue)
      {
        if(lstFilterDet.length>0)
        {
          lstFilterDet.push(lstData[i]);
        }else{
          lstFilterDet=[lstData[i]];
        }
  
  
      }
    }
    
    return  lstFilterDet;
  }
  
  
  
  CheckOption4(lstData,SValue):[]
  {
    
   var  lstFilterDet:any=[];
    for(var i=0;i<lstData.length;i++)
    {
    
      if(lstData[i].OPName4== SValue)
      {
        if(lstFilterDet.length>0)
        {
          lstFilterDet.push(lstData[i]);
        }else{
          lstFilterDet=[lstData[i]];
        }
  
  
      }
    }
    
    return  lstFilterDet;
  }
  
  CheckOption1(lstData,SValue):[]
  {
    
   var  lstFilterDet:any=[];
    for(var i=0;i<lstData.length;i++)
    {
    
      if(lstData[i].OPName1== SValue)
      {
        if(lstFilterDet.length>0)
        {
          lstFilterDet.push(lstData[i]);
        }else{
          lstFilterDet=[lstData[i]];
        }
  
      }
    }
    
    return  lstFilterDet;
  }
   addDays = (date: Date, days: number): Date => {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
  ExpectedDeliveryDays="";
  DeliveryCharges:number=0;
  mDeliveryCharges=0;
  showDeliveryStatusmsg=false;
 

  checkDeliveryAvailability(price)
  {
    
    let deliveryZipCode=$("#deliveryZipCode").val();
    if(typeof(deliveryZipCode)!='undefined' && deliveryZipCode!='')
    {
    $("#preloader").show();

   
this.store.dispatch(new  PageStore.OpenPage({viewName:'selectedZipCode',deliveryZipCode}));
    

this.apiCall.DBCalling("CheckDeliveryAvailability",deliveryZipCode,price,"","").subscribe(
    (res) => {
      
      this.showDeliveryStatusmsg=true;
      
     let dbResult:any= (res);
if(dbResult.tasks.length>0)
{
  let ExpectedDeliveryDays=typeof(dbResult.tasks[0][0]['ExpectedDeliveryDays'])=='undefined' ? '' :dbResult.tasks[0][0]['ExpectedDeliveryDays'];
  this.DeliveryCharges=(typeof(dbResult.tasks[0][0]['DeliveryCharges'])=='undefined' ? -1 :(+dbResult.tasks[0][0]['DeliveryCharges']));
  this.mDeliveryCharges=(+dbResult.tasks[0][0]['DeliveryCharges']);
  this.showDeliveryStatusmsg=this.DeliveryCharges==-1 ? false :true;
  try{
    if(ExpectedDeliveryDays!=''){
      const date: Date = new Date();
      const dateResult: Date = this.addDays(date, (+ExpectedDeliveryDays));
     
      this.ExpectedDeliveryDays = dateResult.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    }else{
      this.ExpectedDeliveryDays =''; 
    }
  

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

     $("#preloader").hide();
    }
);
  }
}


  OptionsChange(event,target,index)
  {
     
   


var lstFilterDet:any[];
var lstFilterDet1:any[];
var ReslstFilterDet:any[];

if(index==1)
{
 
  this.SelectedOption1=target;
 
 
this.SelectedOption2="";
this.SelectedOption3="";
this.SelectedOption4="";
}

if(index==2)
{
 
  this.SelectedOption2=target;

this.SelectedOption3="";
this.SelectedOption4="";
}

if(index==3)
{
  this.SelectedOption3=target;
 
this.SelectedOption4="";
}

if(index==4)
{
  this.SelectedOption4=target;
  
}
 lstFilterDet=this.CheckOption1( this.lstProducts,this.SelectedOption1);

 


if( this.SelectedOption2!="" && (lstFilterDet.length>1))
{
  
  lstFilterDet1=this.CheckOption2( lstFilterDet,this.SelectedOption2);
  lstFilterDet=lstFilterDet1;
  
  //this.SelectedOption3=lstFilterDet.length==1 ? lstFilterDet[0].OPName3 : '';
} 

if(this.SelectedOption3!="" && (lstFilterDet.length>1))
{
  
  lstFilterDet1=this.CheckOption3( lstFilterDet,this.SelectedOption3);
  lstFilterDet=lstFilterDet1;
}

 if(this.SelectedOption4="" && (lstFilterDet.length>1))
{
  
  lstFilterDet1=this.CheckOption4(lstFilterDet,this.SelectedOption4);
  lstFilterDet=lstFilterDet1;
}





if(lstFilterDet.length>0)

{
  var Sindex =0;
  var  MaxOptions =0;

for(var i=0;i<lstFilterDet.length;i++)
{
if(lstFilterDet[i].OPName1!="" &&   lstFilterDet[i].OPName2!="" && lstFilterDet[i].OPName3!="" && lstFilterDet[i].OPName4!="" )
{
  Sindex=i;
  MaxOptions=4;

  
}

if(lstFilterDet[i].OPName1!="" && lstFilterDet[i].OPName2!="" && lstFilterDet[i].OPName3!="" && MaxOptions<4)
{
  Sindex=i;
  MaxOptions=3;
}


if(lstFilterDet[i].OPName1!="" && lstFilterDet[i].OPName2!=""  && MaxOptions<3)
{
  Sindex=i;
  MaxOptions=2;
}


if(lstFilterDet[i].OPName1!=""  && MaxOptions<2)
{
  Sindex=i;
  MaxOptions=2;
}

}

  


var resD1=(((lstFilterDet[Sindex].SetDetails).replace(/\n/g, "")).replace(/'/g,"\""));
var resChild1=JSON.parse(resD1);
  this.lstset=resChild1==''?[]:resChild1;
    
  this.lstCurrentDet=lstFilterDet[Sindex];

  this.SelectedOption1=lstFilterDet[Sindex].OPName1;

  this.SelectedOption2=lstFilterDet[Sindex].OPName2;


  this.SelectedOption3=lstFilterDet[Sindex].OPName3;
  this.SelectedOption4=lstFilterDet[Sindex].OPName4;
  try{
    
       var resDF=(((this.lstCurrentDet['Features']).replace(/\n/g, "")).replace(/'/g,"\""));
    var resChildF=JSON.parse(resDF);
    this.lstCurrentDet['Features']=resChildF;
    }catch(e)
    {

    }

    try{
    
      
    var resD2=(((this.lstCurrentDet['lst1Options']).replace(/\n/g, "")).replace(/'/g,"\""));
    var resChild2=JSON.parse(resD2);
    this.lstCurrentDet['lst1Options']=resChild2;
  
    }catch(e)
    {

    }

   // if(index==1)
    {
      try{
        
      var resD=(((this.lstCurrentDet['lst2Options']).replace(/\n/g, "")).replace(/'/g,"\""));
      var resChild=JSON.parse(resD);
      this.lstCurrentDet['lst2Options']=resChild;
    }catch(e)
    {

    }
      this.lstOp2=this.CheckOptionB(this.lstCurrentDet['lst2Options']);
    }
   // if(index==2)
    {
      try{
      var resD=(((this.lstCurrentDet['lst3Options']).replace(/\n/g, "")).replace(/'/g,"\""));
      var resChild=JSON.parse(resD);
      this.lstCurrentDet['lst3Options']=resChild;
    }catch(e)
    {

    }
      this.lstOp3=this.CheckOptionC(this.lstCurrentDet['lst3Options']);
    }
    
    {
      try{
      var resD=(((this.lstCurrentDet['lst4Options']).replace(/\n/g, "")).replace(/'/g,"\""));
      var resChild=JSON.parse(resD);
      this.lstCurrentDet['lst4Options']=resChild;
    }catch(e)
    {

    }
      this.lstOp4=this.CheckOptionD(this.lstCurrentDet['lst4Options']);
    }
     
    

}

this.Imagesrc=this.lstCurrentDet.Image1;

this.galleryImages=[];

if(this.lstCurrentDet.Image1!='' && this.lstCurrentDet.Image1!='0'){
  this.galleryImages.push({small:this.ImagePath+this.lstCurrentDet.Image1,medium:this.ImagePath+this.lstCurrentDet.Image1,big:this.ImagePath+this.lstCurrentDet.Image1})
}
if(this.lstCurrentDet.Image2!='' && this.lstCurrentDet.Image2!='0'){
  this.galleryImages.push({small:this.ImagePath+this.lstCurrentDet.Image2,medium:this.ImagePath+this.lstCurrentDet.Image2,big:this.ImagePath+this.lstCurrentDet.Image2})
}
if(this.lstCurrentDet.Image3!='' && this.lstCurrentDet.Image3!='0'){
  this.galleryImages.push({small:this.ImagePath+this.lstCurrentDet.Image3,medium:this.ImagePath+this.lstCurrentDet.Image3,big:this.ImagePath+this.lstCurrentDet.Image3})
}
if(this.lstCurrentDet.Image4!='' && this.lstCurrentDet.Image4!='0'){
   this.galleryImages.push({small:this.ImagePath+this.lstCurrentDet.Image4,medium:this.ImagePath+this.lstCurrentDet.Image4,big:this.ImagePath+this.lstCurrentDet.Image4})
}
if(this.lstCurrentDet.Image5!='' && this.lstCurrentDet.Image5!='0'){
   this.galleryImages.push({small:this.ImagePath+this.lstCurrentDet.Image5,medium:this.ImagePath+this.lstCurrentDet.Image5,big:this.ImagePath+this.lstCurrentDet.Image5})
}
if(this.lstCurrentDet.Image6!=''&& this.lstCurrentDet.Image6!='0'){
   this.galleryImages.push({small:this.ImagePath+this.lstCurrentDet.Image6,medium:this.ImagePath+this.lstCurrentDet.Image6,big:this.ImagePath+this.lstCurrentDet.Image6})
}

this.galleryOptions[0].thumbnailsColumns=this.galleryImages.length



}
SizeChartDescription:string="";


DProductName="";
AddtoCartClick(Qty,check)
{
debugger;
var lstofProduct=this.lstCurrentDet;
var valid=true;

  try{
  valid=true;
  let  obj=new  CartList();
  obj.MerchantID=this.MerchantID;
  obj.ProductName=lstofProduct.ProductName;
  obj.ProductCode=lstofProduct.ProductCode;
  obj.ProductQty=this.getproductAvailableqty();
  obj.ProductLongDesc=lstofProduct.ProductLongDesc;
  obj.ProductImage=  this.ImagePath+this.Imagesrc;
  obj.Price=lstofProduct.Price;
 
  obj.SalesPrice=lstofProduct.SalesPrice;
  obj.OPGName1=lstofProduct.OPGName1;
  obj.IsWishListItem=this.IsWishListItem.toString();
  obj.OPGName2=lstofProduct.OPGName2;
  
  obj.OPGName3=lstofProduct.OPGName3;
  obj.OPGName4=lstofProduct.OPGName4;
  obj.ProductID=lstofProduct.ProductID;
  obj.ProductOptionID=lstofProduct.ProductOptionID;
  obj.OPName1=lstofProduct.OPName1;
  obj.OPName2=lstofProduct.OPName2;
  obj.OPName3=lstofProduct.OPName3;
  obj.OPName4=lstofProduct.OPName4;

  obj.ParentID='0';

  obj.Qty=Qty;
  
  obj.OPName3=lstofProduct.OPName3;
  obj.OPName4=lstofProduct.OPName4;
  
var strExtraPieces="";
  if(this.lstSetItemList.length>0)
  {
for(let s=0;s<this.lstSetItemList.length;s++)
{
  let  obj1=new  CartList();
  obj1.MerchantID=this.MerchantID;
  obj1.ProductName=this.lstSetItemList[s].ProductName;
  obj1.ProductCode=this.lstSetItemList[s].ProductCode;
  obj1.ProductLongDesc=this.lstSetItemList[s].ProductLongDesc;
  obj1.ProductImage=  this.ImagePath+this.lstSetItemList[s].OptionItem.Image;
  obj1.Price=this.lstSetItemList[s].Price;
  obj1.SalesPrice=this.lstSetItemList[s].SalesPrice;
  obj1.OPGName1=this.lstSetItemList[s].OPGName1;
  obj.Price=(+obj.Price)+(+this.lstSetItemList[s].Price);
  obj.SalesPrice=(+obj.SalesPrice)+(+this.lstSetItemList[s].SalesPrice);
  obj1.OPGName2=this.lstSetItemList[s].OPGName2;
  obj.IsWishListItem=this.lstSetItemList[s].IsWishListItem.toString();
  obj1.OPGName3=this.lstSetItemList[s].OPGName3;
  obj1.OPGName4=this.lstSetItemList[s].OPGName4;
  obj1.ProductID=this.lstSetItemList[s].ProductID;
  obj1.ProductOptionID=this.lstSetItemList[s].ProductOptionID;
  obj1.OPName1=this.lstSetItemList[s].OPName1;
  obj1.OPName2=this.lstSetItemList[s].OPName2;
  obj1.OPName3=this.lstSetItemList[s].OPName3;
  obj1.OPName4=this.lstSetItemList[s].OPName4;
  obj1.ParentID=this.lstCurrentDet.ProductOptionID;
  obj1.Qty=Qty;
  obj1.OPName3=this.lstSetItemList[s].OPName3;
  obj1.OPName4=this.lstSetItemList[s].OPName4;
  obj1.CalcTotal();
  obj.lstSet.push(obj1)
  if(s==0)
  {
    strExtraPieces=this.lstSetItemList[s].ProductName;

  }else{
    strExtraPieces=strExtraPieces+','+this.lstSetItemList[s].ProductName;

  }

}

obj.ExtraPieces=strExtraPieces;
  }
  obj.CalcTotal();

  
  this.lstSetItemList=[];
  this.objCart.AddToCart(obj);
  this.store.dispatch(new  PageStore.OpenPage({viewName:'CartList',lstCartList:this.objCart.lstCartList}));
if(check=='cart'){

 
  Swal.fire({
    title: "Product has been added to your cart",
    timer: 2000,
  });
}

this.DProductName=obj.ProductName;



this.CQty=1;
  }catch(e){
    console.log(e)
  }
  
  
}

BuyNowProduct(){
  debugger;
  var lstofProduct=this.lstCurrentDet;
  if(this.loginUserDetails.UserID==0 ){
    debugger;
    
    this.App.loginClick()
  }else{
    debugger;
    var lst:any=[];
   
    let  obj=new  CartList();
    obj.MerchantID=this.MerchantID;
    obj.ProductName=lstofProduct.ProductName;
    obj.ProductCode=lstofProduct.ProductCode;
    obj.ProductQty=this.getproductAvailableqty();
    obj.ProductLongDesc=lstofProduct.ProductLongDesc;
    obj.ProductImage=  this.ImagePath+this.Imagesrc;
    obj.Price=lstofProduct.Price;
   
    obj.SalesPrice=lstofProduct.SalesPrice;
    obj.OPGName1=lstofProduct.OPGName1;
    obj.IsWishListItem=this.IsWishListItem.toString();
    obj.OPGName2=lstofProduct.OPGName2;
    
    obj.OPGName3=lstofProduct.OPGName3;
    obj.OPGName4=lstofProduct.OPGName4;
    obj.ProductID=lstofProduct.ProductID;
    obj.ProductOptionID=lstofProduct.ProductOptionID;
    obj.OPName1=lstofProduct.OPName1;
    obj.OPName2=lstofProduct.OPName2;
    obj.OPName3=lstofProduct.OPName3;
    obj.OPName4=lstofProduct.OPName4;
  
    obj.ParentID='0';
  
    obj.Qty=1;
    
    obj.OPName3=lstofProduct.OPName3;
    obj.OPName4=lstofProduct.OPName4;
    obj.CalcTotal();
    lst.push(Object.assign({},obj))
    this.store.dispatch(new  PageStore.OpenPage({viewName:'Buylst',lstCartList:lst}));

    // this.router.navigateByUrl('/checkout');
    this.router.navigate(['/checkout'], { queryParams: {  navigateFrom:'BuyNow'} });
    // this.App.checkoutClick();
  }
 
}

getproductAvailableqty(){
  
  return this.lstCurrentDet.Availableqty;
}

GetPurchaseQty(PurchaseProductList){

 
  return typeof(this.objCart.getPurchaseqtyfromcart(PurchaseProductList))=='undefined' ? '' :this.objCart.getPurchaseqtyfromcart(PurchaseProductList);
}
CQty=1;
UserID='0';
lstSetItemList:any=[];
Addedcart(){
  
 
}
AddWishlist()
{
 debugger; 
 
 this.UserID=this.loginUserDetails.UserID==0 ? this.UserID:this.loginUserDetails.UserID;

 
var ExItems="";
var strExtraPieces="";
if(this.lstSetItemList.length>0)
{
 for(let s=0;s<this.lstSetItemList.length;s++)
 {

  ExItems=ExItems+"<Table1>"
 
  +'<UserID>'+this.UserID+'</UserID>'
  +'<ProductOptionID>'+this.lstSetItemList[s].ProductOptionID+'</ProductOptionID>'
  +'<ParentID>'+this.lstCurrentDet.ProductOptionID+'</ParentID>'
  +'<ExtraPieces></ExtraPieces>'
  +"</Table1>"
  if(s==0)
  {
    strExtraPieces=this.lstSetItemList[s].ProductName;

  }else{
    strExtraPieces=strExtraPieces+','+this.lstSetItemList[s].ProductName;

  }

 }
}

 var rows="<Table1>"
 
 +'<UserID>'+this.UserID+'</UserID>'
 +'<ProductOptionID>'+this.lstCurrentDet.ProductOptionID+'</ProductOptionID>'
 +'<ParentID>'+0+'</ParentID>'
 +'<ExtraPieces>'+strExtraPieces+'</ExtraPieces>'
 +"</Table1>"
 ;
 rows= '<NewDataSet>'+rows+ExItems+'</NewDataSet>';   

 this.apiCall.DBCalling("SaveWishList",rows,"","","").subscribe(
  (res) => {

  let DbResult:any= (res);

  if(DbResult.tasks.length>0 )
  {

for(let i=0;i<DbResult.tasks.length;i++)
{

if(DbResult.tasks[i].length>0)
{

if(DbResult.tasks[i][0].DBresult>0)
{
  $("#ctrlWishList").css("background-position", "-2800px 0");
  $("#ctrlWishList").css("transition", "background 1s steps(28)");
}
}
}
Swal.fire({
  title: "Product has been added to your Wishlist",
  timer: 2000,
});
this.WishList.GetDetailsfromWishList(this.UserID)
  }

  });

}
async productMouseOverCall(productId)
{


await this.apiCall.DBCalling("GetProductOptionsShortDetByProductId",productId,"","","").subscribe(
  async (res) => {

    let opResult:any= (res);
    var resD=(((opResult.tasks[0][0].Result).replace(/\n/g, "")).replace(/'/g,"\""));
    var resChild=JSON.parse(resD)
if(resChild.length>0)
{
  await this.prepareOptionsString( resChild);

}
  }
);
}

ProductClick(ProductOptionID,ProductID,ProductImage)
{
  

this.router.navigate(['/ProductDetails'], { queryParams: {  OptionID:ProductOptionID,ID:ProductID,Img:ProductImage} });
}
selectedProductOptions=[]
prepareOptionsString(selectedProductOptions)
{
  this.selectedProductOptions=[];
  //
  let Options=[];
  

  for(let d=0;d<selectedProductOptions.length;d++)
  {

   let extind=Options.findIndex(x=>x==selectedProductOptions[d].OptionGroupName);
    if(extind==-1)
    {
      Options.push(selectedProductOptions[d].OptionGroupName);

    }
  }

for(let i=0;i<Options.length;i++)
{
  //
  const array = selectedProductOptions.map(item => ( item.OptionGroupName ==Options[i]?item.OptionName:null));
  const filteredArray = array.filter(value => value !== null && value !== undefined);
  const result = filteredArray.join(',');
if(result!='')
{
  this.selectedProductOptions.push({'Name':Options[i],'Options':result});
}
}
  
  


}

ArryLimit=4;
RelatedProductslength=0;
getRelatedProducts()
{


  
  try{
    
  var res= this.lstRelatedProducts.filter(x => x.ProductID != this.DProductID);
  const uniqueProducts = this.lstRelatedProducts.reduce((result, product) => {
    // Use a Set to keep track of unique product IDs
    const idsSet = new Set(result.map(p => p.ProductID));
  
    // If the product's ID is not in the Set, add it to the result array
    if (!idsSet.has(product.ProductID)) {
      result.push(product);
    }
  
    // Return the intermediate result for the next iteration
    return result;
  }, []);
  
  this.RelatedProductslength=res.length;
 
 
  return uniqueProducts;
  
  

  }catch(e)
  {

  }




}
ServerPath="";
SharePath="";


share(type)
{
  switch(type)
  {
case 'Twitter':
{
  window.open("https://twitter.com/share?url=" + encodeURIComponent(this.SharePath), "_blank", "height=400,width=550");

  break;
}
case 'Whatsapp':
{
  window.open("https://web.whatsapp.com/send?text="+encodeURIComponent(this.SharePath)+""," _blank", "height=400,width=550");

  break;
}

case 'Facebook':
{
  window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(this.SharePath), "_blank", "height=400,width= 550");


  break;
}

case 'Whatsapp':
{
  window.open("https://api.whatsapp.com/send?text=" + encodeURIComponent(this.SharePath), "_blank" , "height=400,width= 550");


  break;
}

case 'Instagram':
{
  window.open("https://api.instagram.com/oauth/authorize/?client_id=CLIENT-ID&redirect_uri=REDIRECT-URI&response_type=token" + encodeURIComponent(this.SharePath), "_blank", "height=400,width= 550");


  break;
}
case 'Copy link':
{
const textarea = document.createElement('textarea');
  textarea.value = this.SharePath;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  break;
}
  }

}
clickonView(){
  
  
}

ngAfterViewInit()
{
  
  // /$("#ctpcontainer").scrollTop(100);
  
 
  window.scrollTo(0,0);

}
  getProductOptionDetailsByProductID()
  {
  //  this.apiCall.DBCalling("OnlineOrderProductOptionDetailsByProductID",ID,UserID,"","")


$("#preloader").show();

this.apiCall.DBCalling("OnlineOrderProductOptionDetailsByProductID",this.DProductID,0,"","").subscribe(
    (res) => {
     let dbResult:any= (res);
      this.lstProducts=[];
      
      if(dbResult.tasks[0].length>0 )
      {
        
        this.lstProducts=dbResult.tasks[0];
        
        this.lstRelatedProducts=dbResult.tasks[1];
        for(let i=0;i<this.lstRelatedProducts.length;i++){
          if(this.lstRelatedProducts[i].ProductRating==="5.0000"){
            this.lstRelatedProducts[i].ProductRating="5";
          }
        }

      
        this.MerchantID=this.lstProducts[0]["MerchantID"];
        for(var i=0;i<this.lstProducts.length;i++)
        {


        

          try
          {

            var resD=(((this.lstProducts[i]["lst1Options"]).replace(/\n/g, "")).replace(/'/g,"\""));
          var resChild=JSON.parse(resD);
          
          
               
                this.lstProducts[i]["lst1Options"]=resChild

             this.lstset=resChild[0].SetDetails==''?[]:resChild[0].SetDetails;

                this.SelectedOption1=resChild[0].OptionName 
                

              }catch(e)
              {
  
              }
                try
                {



                var resD=(((this.lstProducts[i]["lst2Options"]).replace(/\n/g, "")).replace(/'/g,"\""));
                var resChild=JSON.parse(resD);
                
                
                     
                      this.lstProducts[i]["lst2Options"]=resChild
                      
                   debugger;
                      this.SelectedOption2=this.SelectedOption2=='' ? resChild[0].OptionName :this.SelectedOption2;
                    
                     this.OptionsChange('',this.SelectedOption2,2)

                    }catch(e)
                    {
        
                    }


                      try
          {
                      var resD=(((this.lstProducts[i]["lst3Options"]).replace(/\n/g, "")).replace(/'/g,"\""));
                      var resChild=JSON.parse(resD);
                      
                      
                      
                            this.lstProducts[i]["lst3Options"]=resChild
                            this.SelectedOption3=this.SelectedOption3=='' ? resChild[0].OptionName :this.SelectedOption3;
                           
                          
                          }catch(e)
                          {
              
                          }

                            try
                            {

                            var resD=(((this.lstProducts[i]["lst4Options"]).replace(/\n/g, "")).replace(/'/g,"\""));
                            var resChild=JSON.parse(resD);
  
                                  this.lstProducts[i]["lst4Options"]=resChild
                                  this.SelectedOption4=resChild[0].OptionName;;

                                }catch(e)
                                {
                    
                                }



                                try{
  
                                  var resDF=(((this.lstProducts['Features']).replace(/\n/g, "")).replace(/'/g,"\""));
                               var resChildF=JSON.parse(resDF);
                               this.lstProducts['Features']=resChildF;
                               }catch(e)
                               {
                           
                               }
                           



                                  
        
if(this.lstProducts[i].ProductOptionID==this.DOptionID)
{
this.IsWishListItem=this.lstProducts[i].IsWishListItem;
this.lstCurrentDet=this.lstProducts[i];

this.Imagesrc=this.lstCurrentDet.Image1;
this.lstOp2=this.CheckOptionB(this.lstCurrentDet['lst2Options'])
this.lstOp3=this.CheckOptionC(this.lstCurrentDet['lst3Options'])
this.lstOp4=this.CheckOptionD(this.lstCurrentDet['lst4Options'])
}
      }
    }
    this.ServerPath=document.location.origin;
    this.SharePath= this.ServerPath+"/#/ProductDetails?ID="+this.DProductID+"&OptionID="+this.DOptionID+"&Img"+this.RawImagePath;
     
    window.scrollTo(0,0);
      $("#preloader").hide();
     
    
    });
  }
}
