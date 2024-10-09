import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { APICallingService } from '../model/APICallingService';
import * as PageStore from "src/app/Store/PageStore/Page.Actions";
import * as $ from 'jquery';
import { AppSettings, IAppSettings } from '../model/AppSettings';
import "../../../node_modules/owl.carousel/dist/owl.carousel.js";

import { loginDetails } from '../UserDetails';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
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

hover=false;
  constructor(private apiCall:APICallingService,private store: Store<any>,public router:Router,public appSettings:AppSettings) {
    this.storeSettings=   this.appSettings.loadSettings();
    this.ImagePath=this.storeSettings.apiCallingUrl;
    this.getHomescreenSettings();
   }

   getcurrency(){

    return this.storeSettings.currency;
  }
  SelectedBrandId:string="0";
  SelectedBrandName:string="";
  SelectedCategoryId:string="0";
  SelectedCategoryname:string="";
  BrandchngeEvent(Id){
    debugger;
    if(Id==0){
     this.SelectedBrandId=Id;
    }else{
      var data=this.lstBrands.filter(x=>x.BrandID==Id)[0]
      this.SelectedBrandId=data.BrandID;
     this.SelectedBrandName=data.BrandName;
     this.validationerror='';
     this.lstCategoriesMainDet=[];
     debugger;
     this.lstCategoriesMainDet=this.getcategoryBybrand()
      
    }
    
  }
  getUniqueProducts(filter,BrandId,Categoryname){
    debugger;
  
    const indexes = filter.reduce((r, n, i) => {
      n.Categoryname === Categoryname && n.BrandID === BrandId && r.push(i);
      
      return r;
    }, []);

   if(indexes.length>1){
    for(let i=1;i<indexes.length;i++){
debugger;
      
      filter.splice(indexes[i],1)


    }
   }

   return filter;
  }

 
  getcategoryBybrand(){
    debugger;
    

    var filter:any=[]
    filter=this.lstCategories.filter(x=>x.BrandID==this.SelectedBrandId);
   for(let i=0;i<filter.length;i++){
      filter =this.getUniqueProducts(filter,filter[i].BrandID,filter[i].Categoryname)
   }
   return filter
    

  }

  
  CategorychngeEvent(Id){
    
    if(Id==0){
      this.SelectedCategoryId=Id;
    }else{
    var data=this.lstCategories.filter(x=>x.CategoryID==Id)[0]
    this.SelectedCategoryId=data.CategoryID;
   this.SelectedCategoryname=data.Categoryname;
   this.validationerror1='';
    }
  }
  //  rtl:true,
   ImagePath=this.storeSettings.apiCallingUrl;
   SlideOptions = { items: 1, dots: false, nav: true ,loop:true,autoplay:true,
    autoplayTimeout:3000,
    autoplayHoverPause:true,
    navText: ['<div  style="background-size: 170%; position: absolute; top: 50%; margin-top: -1.6em; z-index: 60; height: 3em; width: 2.6em; background-image: url(../../assets/img/slide/arrows.png);background-position: 0 0; left:10px;" ></div>','<div style="background-size: 170%; position: absolute; top: 50%; margin-top: -1.6em; z-index: 60; height: 3em; width: 2.7em; background-image: url(../../assets/img/slide/arrows.png);right:10px; background-position: 100% 0;" ></div>']
  };

   CarouselOptions = { items: 3, dots: true, nav: true };  
   SearchStr="";
   lstHomeScreanSettings=[];
   lstRegion=[];
   FlashString="";
   lstBanners=[];
   isHomeScreenContainsLeftRegion=false;
isHomeScreenContainsRightRegion=false;

selectedProductOptions=[];

prepareOptionsString(selectedProductOptions)
{
  this.selectedProductOptions=[];
  //
  let Options=[];
  //const uniqueArray = selectedProductOptions.filter((item, index) => selectedProductOptions.indexOf(item.OptionGroupName) === index);

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



lstBrands=[];
viewBrands()
{
   this.apiCall.DBCalling("ViewBrand","","","","").subscribe(
    async (res) => {
    
      let brnadResult:any= (res);
      this.lstBrands=brnadResult.tasks[0];
      
    }
  );
}

lstCategories=[];
lstCategoriesMainDet:any=[];
viewCategories()
{
   this.apiCall.DBCalling("ViewCategoryByProducts",'',"","","").subscribe(
    async (res) => {
      //
      let catResult:any= (res);
      const uniqueProducts = catResult.tasks[0].reduce((result, product) => {
        
        const idsSet = new Set(result.map(p => p.CategoryID));
        if (!idsSet.has(product.CategoryID)) {
          result.push(product);
        }
        return result;
      }, []);
      this.lstCategories=catResult.tasks[0];
      this.lstCategoriesMainDet=uniqueProducts;
     
    }
  );
}

async productMouseOverCall(productId)
{
//

await this.apiCall.DBCalling("GetProductOptionsShortDetByProductId",productId,"","","").subscribe(
  async (res) => {
    //
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
getHomescreenSettings()
{
debugger;
  $("#preloader").show();


 this.apiCall.DBCalling("GetHomeScreenSettingDetails","","","","").subscribe(
  (res) => {
    debugger;
    
    let HResult:any= (res);
    this.lstHomeScreanSettings=[];
    if(HResult.tasks.length>0 && HResult.tasks[0].length>0 )
    {

      debugger;
   
      this.lstHomeScreanSettings=HResult.tasks[0];
      
this.lstRegion=HResult.tasks[1];
this.isHomeScreenContainsLeftRegion=   (this.lstHomeScreanSettings.filter(x=> x.Region=='Left')).length>0?true:false;
this.isHomeScreenContainsRightRegion=   (this.lstHomeScreanSettings.filter(x=> x.Region=='Right')).length>0?true:false;

 
 for(var i=0;i<this.lstHomeScreanSettings.length;i++)
      {
      
        if(this.lstHomeScreanSettings[i].LayoutViewType=='FlashMassage')
        {
this.FlashString=this.FlashString+this.lstHomeScreanSettings[i].SubTiltle;
        }
        try
        {
          var resD=(((this.lstHomeScreanSettings[i]["Child"]).replace(/\n/g, "")).replace(/'/g,"\""));
               var resChild=JSON.parse(resD);
             
              this.lstHomeScreanSettings[i]["Child"]=resChild;
              
              // getting unique products
              // for (var g=0;g<resChild.length;g++ ){
                
              //   for(var h=0;h<resChild[g].ChildDetails.length;h++ ){
                  
              //     if(resChild[h].ChildDetails==''){
                    
              //       resChild[h].ChildDetails=[];
              //     }else{
                    
              //         let productsss = resChild[h].ChildDetails.filter(
              //     (thing, i, arr) => arr.findIndex(t => t.ProductImage === thing.ProductImage) === i
              //   );

              //   debugger;
              //     resChild[h].ChildDetails=productsss
              //     }
              //   }
              // }
            }catch(e)
        {

        }


       

      }
      this.store.dispatch(new  PageStore.OpenPage(this.lstHomeScreanSettings));
    //  this.persistenceService.set("HomeScreanSettings",this.lstHomeScreanSettings, {type: StorageType.SESSION});
     
    }
   
  });


  
this.apiCall.DBCalling("ViewBanners",(this.SearchStr==null?"":this.SearchStr),"","","").subscribe(
(res) => {
  
  //
 let Result:any= (res);
  this.lstBanners=null;
  if(Result.tasks.length>0){

 
  if(Result.tasks[0].length>0 )
  {
    this.lstBanners=Result.tasks[0];

    this.CarouselOptions = { items: this.lstBanners.length, dots: true, nav: true };  
  }
  else{
    Result=[];
  }
}
  
    $("#preloader").hide();
  
});
this.viewBrands();
this.viewCategories();
}


ProductClick(ProductOptionID,ProductID,ProductImage)
{
this.GetProductOptionIdByProduct(ProductOptionID,ProductID,ProductImage)

}
GetProductOptionIdByProduct(ProductOptionID,ProductId,ProductImage){

  this.apiCall.DBCalling("ProductOptionsByProductID",ProductId,"","","").subscribe(
    async (res:any) => {
   
      let listofProducts:any= (res.tasks[0]);
      this.router.navigate(
        ['/ProductDetails'],
        { queryParams: { OptionID:ProductOptionID , ID:ProductId,Img:ProductImage,option2:listofProducts[0].OptionName1,option3:listofProducts[0].OptionName2} }
      );
     
    })
    
}
ProductDetByType(Type,ID,Image,DName)
{

debugger;
this.router.navigate(
  ['/ProductSearchAndFilter'],
  { queryParams: { Type:Type , ID:ID,Name:DName,Img:Image} }
);

}



BannerClick(BannerType,BannerTypeId,Image,DName,IsParentCategory)
{

debugger;
if(IsParentCategory!="0")
{
//this.router.navigateByUrl('/CategoryDetByParentCategory', { state: { ID:BannerTypeId,Name:DName,Img:Image} });

this.router.navigate(
  ['/CategoryDetByParentCategory'],
  { queryParams:  { ID:BannerTypeId,Name:DName,Img:Image}}
);


}else{
  //this.router.navigateByUrl('/ProductDetailsByType', { state: { Type:BannerType , ID:BannerTypeId,Name:DName,Img:Image} });



  this.router.navigate(
    ['/ProductSearchAndFilter'],
    { queryParams: { Type:BannerType , ID:BannerTypeId,Name:DName,Img:Image} }
  );

}
}
validationerror:string="";
validationerror1:string="";
SearchByProduct()
{


if(this.SelectedCategoryId!='0' && this.SelectedBrandId!='0' ){
  this.validationerror='';
  this.validationerror1='';
  this.router.navigate(
    ['/ProductSearchAndFilter'],
    { queryParams: { Type: 'Brand', ID:this.SelectedBrandId,Name:'',Img:'',CategoryId:this.SelectedCategoryId} }
  );
}else if(this.SelectedCategoryId!='0'){
  this.validationerror1='';
  this.router.navigate(
    ['/ProductSearchAndFilter'],
    { queryParams: { Type: 'Category', ID:this.SelectedCategoryId,Name:'',Img:''} }
  );
}else if(this.SelectedBrandId!='0'){
  this.validationerror='';
  this.router.navigate(
    ['/ProductSearchAndFilter'],
    { queryParams: { Type: 'Brand', ID:this.SelectedBrandId,Name:'',Img:''} }
  );
}else{
 
    this.validationerror1='Please Select Category**';
        this.validationerror='Please Select Brand**';
  
}


// else {
//   if(this.SelectedCategoryId=='0' && this.SelectedBrandId=='0'){
//     this.validationerror1='Please Select Category**';
//     this.validationerror='Please Select Brand**';
//   }else if(this.SelectedBrandId=='0'){
//     this.validationerror='Please Select Brand**';
  
//   }
//   else if(this.SelectedCategoryId=='0'){
//     this.validationerror1='Please Select Category**';
  
//   }else{
//     this.validationerror='';
//     this.validationerror1=''
//  }
//}



}
  ngAfterViewInit()
  {
  }
  loginUserDetails:any;
  ngOnInit(): void {
    $('span').removeProp('display')
      this.loginUserDetails= new loginDetails();
      var result = (this.store as any).source['value']['MSECOM'].filter((x:any) => { return x.viewName == "loginDetails"; });
      if (result.length > 0) {
        this.loginUserDetails=( Object.assign({},result[0] ));
      
      }
  }

}
