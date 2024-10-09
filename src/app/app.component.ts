import { Component,ElementRef,Injectable, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';

import * as $ from 'jquery';
import { Cart, CartList } from './Cart';
import { AppSettings, IAppSettings } from './model/AppSettings';
import * as PageStore from "src/app/Store/PageStore/Page.Actions";
import { Router } from '@angular/router';
import { loginDetails } from './UserDetails';
import { APICallingService } from './model/APICallingService';
import Swal from 'sweetalert2';
import { IRegistration } from './Registration';
import { MyWishList } from './Mywishlist';
import './../assets/js/vendor/select2/js/select2.min.js';
// import './../assets/js/vendor/select2/css/select2.min.css';






@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  WishlistDetails:any=[];
  title = 'E-commerceWeb';
  CartTotal=0;
  cartClick=false;
  SearchFilter:string="";
  OrderItemsDiscount=0;
  @ViewChild('BrandSelection') Brandselection:ElementRef;
  wishcount:number=0;
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

  loginUserDetails:any;
  SelectedProductId:string="";
  SelectedProductImage:string="";
  SelectedProductName:String="";
  ngOnInit(): void {
  
  }
  ngAfterViewInit()
  {
   
      $('#preloader').hide();
      
      this.cartDetails();
      this.MyWishlistDetails()
      this.ViewMainCategory()
     this.ViewCategory();
      //this.viewBrands();
      this.viewProducts();
     
      this.LoadSearchDropdown(0)
      $('.js-example-basic-single').attr('style','width:350px!important')
      this.ViewCategoryAndBrand();
  }


  lstCategories:any=[];
  ViewCategory(){
$("#preloader").show();
   

   this.apiCall.DBCalling("ViewCategories",'','','',"").subscribe(
   (res) => {
  
     let dbResult:any= (res);
     this.lstCategories=[];
     if(dbResult.tasks.length>0 && dbResult.tasks[0].length>0 )
     {
       
       this.lstCategories=dbResult.tasks[0].filter(x=>x.ParentCategoryID!=0);

       this.SelectedCategoryId=this.lstCategories[0].CategoryID;
       this.SelectedCategoryFilter=this.lstCategories[0].Categoryname;
       this.LoadSearchDropdown(this.SelectedCategoryId)
  
     }
    
     $("#preloader").hide();
   
   });

  
  }
  PrivacyPolicycheck:boolean=false;
  PrivacyPolicy(event:any){
    debugger;
    if(event==false){
      this.PrivacyPolicycheck=true;
    }else{
      this.PrivacyPolicycheck=false;
    }
  }
  ViewMainCategory(){
 
    // ViewParentCategories
    this.apiCall.DBCalling("ViewParentCategories","","","","").subscribe(
      async (res) => {
     
        let lstMncategory:any= (res);
        this.lstParentCategory = lstMncategory.tasks[0];
        //this.viewCategories(0);
      });
  }

  
  
  format(state) {

    
    if (!state.id) {
      return state.text;
    }
 
    var $state = $(
               `
               <div style="display: flex; align-items: center;">
                  <div><img sytle="display: inline-block;" src="${[state.Image]}" style="height: 30px;width: auto;" /></div>
                  <div style="margin-left: 10px;">
                     ${state.text}
                  </div>
               </div>
               `
             );
             return $state;

  };
  ProductOptionId:number=0;
  SelectedProductoption2:string="";
  SelectedProductoption3:string="";
  LoadSearchDropdown(CategoryId) {
 debugger;
    
    var that = this;
    (<any>$(".js-example-basic-single")).select2({
      allowClear: true,
      placeholder: "Search for Product",
      ajax: {
        url: that.storeSettings.apiCallingUrl+'ValuePass.php',
        type: "POST",
        dataType: 'json',
        delay: 250, minimumInputLength: 4,
        data:
          function (params) {
       
            var sstring = "";
            if (params.term != undefined) {
              sstring = params.term;
            }
           
            return JSON.stringify({ "Operation": 'ViewProductsByCategoryID', "Params": sstring, "Xml2": CategoryId, "Xml3": '', "Xml4": '' })

          }
        ,
        contentType: 'application/json; charset=utf-8',
        processResults: function (response) {
       
          var ResultData = ((response.tasks[0]));
         
          var data = $.map(ResultData, function (obj) {

            obj.id = obj.ProductID;
            obj.text = obj.ProductName; 
            obj.Image = that.storeSettings.apiCallingUrl + obj.ProductImage; 

            return obj;
          });



          return {


            results: data

          };
        },
        cache: false

      }
      , templateResult: this.format
      
    });




    $('.js-example-basic-single').on('select2:open', function (e) {
  
 
     $('.js-example-basic-single').empty()
     $('.js-example-basic-single').attr('style','width:350px!important')
     $('.selection').attr('style','display: initial!important')
     $('.select2-selection__arrow').css('top','15px')
     
    });

    var that = this;
    $('.js-example-basic-single').on('select2:select', function (e) {


      if (typeof ((<any>e).params.data.id) != 'undefined') {
        
        that.SelectedProductId = (<any>e).params.data.id;
        that.SelectedProductName = (<any>e).params.data.text;
        that.SelectedProductImage = (<any>e).params.data.Image;
        that.validationerror='';
      
        that.GetProductOptionIdByProduct( that.SelectedProductId)
      }


    });

    $(".js-example-basic-single").on("select2:unselecting", function (e) {

      
      that.SelectedProductId ='0';
      that.SelectedProductName ='';
      that.SelectedProductImage = '';
      that.SelectedProductoption2='';
       that.SelectedProductoption3='';
 
    
    });

  }

  GetProductOptionIdByProduct(ProductId){
 
    this.ProductOptionId =0;
    this.apiCall.DBCalling("ProductOptionsByProductID",ProductId,"","","").subscribe(
      async (res:any) => {
     
        let listofProducts:any= (res.tasks[0]);
        this.ProductOptionId=listofProducts[0].ProductOptionID;
        
        this.SelectedProductoption2=listofProducts[0].OptionName1;
        this.SelectedProductoption3=listofProducts[0].OptionName2;

       
      })
  }
  validationerror:String='';
  SearchProductByCategory(){
 
    if(this.SelectedProductId!='' && this.SelectedProductId!='0'){
      this.validationerror='';
      this.router.navigate(
        ['/ProductDetails'],
       
        { queryParams: { OptionID:this.ProductOptionId , ID:this.SelectedProductId,Img:this.SelectedProductImage,option2:this.SelectedProductoption2,option3:this.SelectedProductoption3} }
      );   
    }else{
      this.router.navigate(
        ['/ProductSearchAndFilter'],
        { queryParams: { Type: 'category', ID:this.SelectedCategoryId,Name:'',Img:''} }
      );    
    }
   
  }
  SelectedCategoryFilter:string="";
  SelectedCategoryId:string="";
  CategoryEvent(Id){

  var data=this.lstCategories.filter(x=>x.CategoryID==Id)[0]
    this.SelectedCategoryId=data.CategoryID;
   this.SelectedCategoryFilter=data.Categoryname;
    this.LoadSearchDropdown(this.SelectedCategoryId)
  }
  removeClick(product,index)
  {
 debugger;
    this.lstCartList.splice(index,1);
    this.objCart.CalcTotals(this.lstCartList);
   
    this.store.dispatch(new  PageStore.OpenPage({viewName:'CartList',lstCartList:this.lstCartList}));
    location.reload()
  }
  decreaseClick(product,index)
  {
    debugger;
    product.Qty=(+product.Qty)-1;
    if(product.Qty<=0)
    {
      this.lstCartList.splice(index,1);
    }else{
      if(product.Qty>this.lstCartList[index].ProductQty){
        this.lstCartList[index].qtyValidation=true;
      }else{
      this.lstCartList[index].qtyValidation=false;
      }
      this.lstCartList[index].Qty=product.Qty;
      this.lstCartList[index].ProductNetTotal=((+product.Qty)*(+product.SalesPrice)); 
    }
    this.objCart.CalcTotals(this.lstCartList);
    this.store.dispatch(new  PageStore.OpenPage({viewName:'CartList',lstCartList:this.lstCartList}));
   // window.location.reload()
  }
  viewCart()
  {
 if(this.PrivacyPolicycheck){
  this.router.navigateByUrl('/cart');
  this.CheckMarkerrror='';
  this.cartClick=false;
 }else{
  this.CheckMarkerrror='**';
 }
    
    
  }
  mobileheader:boolean=false;
  
  increaseClick(product,index)
  {
 debugger;
 product.Qty=(+product.Qty)+1;
 if(product.Qty>this.lstCartList[index].ProductQty){
  this.lstCartList[index].qtyValidation=true;
 }else{
  this.lstCartList[index].qtyValidation=false;
  this.lstCartList[index].Qty=product.Qty;
  this.lstCartList[index].ProductNetTotal=((+product.Qty)*(+product.SalesPrice)); 
  this.objCart.CalcTotals(this.lstCartList);

  this.store.dispatch(new  PageStore.OpenPage({viewName:'CartList',lstCartList:this.lstCartList}));
  
 }
     
  }

  constructor(private store: Store<any>,public objCart:Cart,private objWish:MyWishList,public appSettings:AppSettings,public router:Router,private apiCall:APICallingService)
  {
    this.storeSettings=   this.appSettings.loadSettings();
    let ImageUrl=this.storeSettings.apiCallingUrl;
    this.store.dispatch(new  PageStore.OpenPage({viewName:'ImageUrl',ImageUrl}));
 
    this.loginUserDetails= new loginDetails();
    var result = (this.store as any).source['value']['MSECOM'].filter((x:any) => { return x.viewName == "loginDetails"; });
    
    if (result.length > 0) {
      this.loginUserDetails=( Object.assign({},result[0] ));
      this.objWish.GetDetailsfromWishList(this.loginUserDetails.UserID)
    }
  }

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
  
  lstCartList=[];
  showButtons:boolean=true;
  getCartdetails(){
    let cartDetails = (this.store as any).source['value']['MSECOM'].filter((x:any) => {
      return x.viewName == 'CartList';
    });
    return typeof(cartDetails)=='undefined' ? {viewName:'CartList',lstCartList:this.lstCartList}:cartDetails;
  }
  
cartDetails()
{
  
  let cartDetails = (this.store as any).source['value']['MSECOM'].filter((x:any) => {
    return x.viewName == 'CartList';
  });
  if( cartDetails.length>0 ) {
 
    this.lstCartList=Object.assign([],  cartDetails[0].lstCartList);
    this.showButtons=this.lstCartList.length==0 ? true :false;
    this.objCart.CalcTotals(this.lstCartList);
    if(this.loginUserDetails.UserFirstName!=''){
      this.userName=(this.loginUserDetails.UserFirstName+this.loginUserDetails.UserLastName)
    }
    
    this.objCart.getCartQty(this.lstCartList);
  }
}

MyWishlistDetails()
{
  
  let WishlistDetails = (this.store as any).source['value']['MSECOM'].filter((x:any) => {
    return x.viewName == 'Mywishlist';
  });
  if( WishlistDetails.length>0 ) {
 
    this.WishlistDetails=Object.assign([],  WishlistDetails[0].WishlistDetails);
   
    this.objWish.GetWishlistCount(this.WishlistDetails);
  }
}
CheckMarkerrror:string="";


  checkoutClick(){
 debugger;
    if(this.loginUserDetails.UserID==0){
      this.loginClick()
    }else if(this.loginUserDetails.UserID>0 && this.PrivacyPolicycheck){
      this.cartClick=false;
     
        this.router.navigateByUrl('/checkout');
       
        this.CheckMarkerrror='';
     
    }else{
      // 
      this.CheckMarkerrror='**';
    }
    
  }

  logoutClick(){
 

    let loginUserDetails=new loginDetails;
    this.lstCartList=[];
    this.userName='My Account';
    this.loginUserDetails.viewName="UserDetails";
    this.WishlistDetails=[];
    this.store.dispatch(new  PageStore.OpenPage(Object.assign({},loginUserDetails)));
    this.store.dispatch(new  PageStore.OpenPage( {viewName:'CartList',lstCartList:this.lstCartList}));
    this.store.dispatch(new  PageStore.OpenPage({viewName:'ImageUrl'}));
    this.store.dispatch(new  PageStore.OpenPage({viewName:'Buylst',lstCartList:this.lstCartList}));
    
    this.store.dispatch(new  PageStore.OpenPage({viewName:'Taxes',CGSTPer:0,SGSTPer:0}));
    this.store.dispatch(new  PageStore.OpenPage({viewName:'Mywishlist',WishlistDetails: this.WishlistDetails}));
    this.router.navigateByUrl('/home')
    .then(() => {
      window.location.reload();
    });
  }

  myAccountClick(){
   
    if(this.loginUserDetails.UserID==0){
      this.loginClick()
    }else{
      this.router.navigateByUrl('/editprofile');
    }
    
  }

  myOrders(){
 
    if(this.loginUserDetails.UserID==0){
      this.loginClick()
    }else{
      this.router.navigateByUrl('/orders');
    }
    
  }

  Mywishlist(){
 
    this.router.navigateByUrl('/MyWishList');
  }

  
  loginClick(){
 
    // this.router.navigateByUrl('/userlogin');
    this.loginmodaldisplay = 'block';
   
    this.login = true;
    this.registrationshow = false;
    this.registration.UserFirstName='';
    this.registration.UserLastName='';
    this.registration.UserCountry='';
    this.registration.UserState='';
    this.registration.UserCity='';
    this.registration.UserAddress='';
    this.registration.UserZip='';
    this.registration.UserEmail='';
    this.registration.UserMobile='';
    this.registration.UserPassword='';
    this.email = "";
    this.password = "";
    this.submited = false;
    this.submitted = false;
  }

  lstCategoriesDet:any=[];
  ParentId:number=0;
  category:boolean=false;
  lstmobilemenu:any=[];
  
  getcategory(brandId,category){

    var filter=this.lstBrandsandcategories[1].filter(x=>x.BrandID==brandId && x.ParentCategoryId==category);

    return filter;

  }
  callMenuByparent(ParentID){

    this.lstBrandsDet=this.GetBranddetails(ParentID);
    this.lstCategoriesDet=this.GetCategorydetails(ParentID)
  }
  viewCategories(ParentID){
 
 
    this.apiCall.DBCalling("ViewCategoryByProducts",ParentID,"","","").subscribe(
      async (res) => {
     
        let lstCategories:any= (res);
        this.lstCategoriesDet = lstCategories.tasks[0];
        console.log(this.lstCategoriesDet)
      });
  }

  lstBrandsDet:any=[];
  viewBrands(){
 
    this.apiCall.DBCalling("ViewBrand","","","","").subscribe(
      async (res) => {
     
        let lstBrands:any= (res);
        this.lstBrandsDet = lstBrands.tasks[0];
      });
  }
  lstBrandsandcategories:any=[];
  ViewCategoryAndBrand(){
 debugger;
    this.lstBrandsDet=[];
        this.lstCategoriesDet=[];
    this.apiCall.DBCalling("ViewProductsBycategoryandbrand",'ViewcategoryByMaincategory',0,0,"").subscribe(
      async (res:any) => {
        debugger;
         this.lstBrandsandcategories= (res.tasks);
         for(let i=0;i<this.lstBrandsandcategories[0].length;i++){
         
          this.lstBrandsandcategories[0][i]['Id']='BrandIndex'+(Math.floor(Math. random() * 100));
          this.lstBrandsandcategories[0][i]['Id2']="catgoryByBrand"+(Math.floor(Math. random() * 100));
         }
         for(let i=0;i<this.lstBrandsandcategories[1].length;i++){
          this.lstBrandsandcategories[1][i]['Id']="category"+this.lstBrandsandcategories[1][i].Categoryname.trim();

         }
         
         this.store.dispatch(new  PageStore.OpenPage({viewName:'Taxes',CGSTPer:this.lstBrandsandcategories[2][0].CGSTPer,SGSTPer:this.lstBrandsandcategories[2][0].SGSTPer}));
      });
  }
  submenu:boolean=false;
  menu:boolean=false;
 
  CallCategoryNamesByBrand2(id1,id2){
debugger;

      const el:any = document.querySelector('#'+id1+'');

    let className=el.nextSibling.__zone_symbol__clickfalse[0].target.className;
    if(className=='offcanvas__sub_menu_toggle'){
      $('#'+id1+'').css({"display": "block"});
      $('#'+id2+'').removeClass('offcanvas__sub_menu_toggle'); 
      $('#'+id2+'').attr('Class','active offcanvas__sub_menu_toggle'); 
    }else{
      $('#'+id1+'').css({"display": "none"});
      $('#'+id2+'').removeClass('active offcanvas__sub_menu_toggle'); 
      $('#'+id2+'').attr('Class','offcanvas__sub_menu_toggle'); 
    }


  }
  CallCategoryNamesByBrand(id2,button){
debugger;

for(let i of button.target.classList){
  if(i=="active")
  {
    button.target.classList.remove("active");
    $('#'+id2+'').css({"display": "none"});
  }else if(i=="offcanvas__sub_menu_toggle")
  {
    button.target.classList.remove("offcanvas__sub_menu_toggle");
  button.target.classList.add("active");
  button.target.classList.add("offcanvas__sub_menu_toggle");
    $('#'+id2+'').css({"display": "block"});

  }

  
};

  }
  GetBranddetails(MncategoryId){
  
    var filterBrand=this.lstBrandsandcategories[0].filter(x=>x.MncategoryId==MncategoryId);
  
    return filterBrand;
  }
  Menuclick2(id,id2){
    debugger;
    const el:any = document.querySelector('#'+id+'');
    let className=el.nextSibling.__zone_symbol__clickfalse[0].target.className;
    if(className=='offcanvas__sub_menu_toggle'){
      $('#'+id+'').css({"display": "block"});
      $('#'+id2+'').removeClass('offcanvas__sub_menu_toggle'); 
      $('#'+id2+'').attr('Class','active offcanvas__sub_menu_toggle'); 
    }else{
      $('#'+id+'').css({"display": "none"});
      $('#'+id2+'').removeClass('active offcanvas__sub_menu_toggle'); 
      $('#'+id2+'').attr('Class','offcanvas__sub_menu_toggle'); 
    }
  }
  menuclick(id,id2){
 debugger;

    if(this.menu==false){
      this.menu=true;
     
      $('#'+id2+'').removeClass('offcanvas__sub_menu_toggle');
      $('#'+id2+'').addClass('active offcanvas__sub_menu_toggle');
      $('#'+id+'').attr('style','box-sizing:border-box;display:block');
      
    }else{
      this.menu=false;
      $('#'+id2+'').removeClass('active offcanvas__sub_menu_toggle');
      $('#'+id2+'').addClass('offcanvas__sub_menu_toggle');
      $('#'+id+'').attr('style','box-sizing:border-box;display:none');
    }
  }
  userName='My Account';
 
  GetCategorydetails(MncategoryId){
 
    const uniqueProducts = this.lstBrandsandcategories[1].reduce((result, product) => {
      // Use a Set to keep track of unique product IDs
      const idsSet = new Set(result.map(p => p.CategoryID));
    
      // If the product's ID is not in the Set, add it to the result array
      if (!idsSet.has(product.CategoryID)) {
        result.push(product);
      }
    
      // Return the intermediate result for the next iteration
      return result;
    }, []);
    var filterCategory=uniqueProducts.filter(x=>x.MncategoryId==MncategoryId);
  
    return filterCategory;

  }


  lstProductsDet:any=[];
  viewProducts(){
 
    this.apiCall.DBCalling("ViewProducts","","","","").subscribe(
      async (res) => {
     
        let lstProducts:any= (res);
        this.lstProductsDet = lstProducts.tasks[0];
      });
  }

  categoryClick(d,e){
 this.mobileheader=false;
    this.CategoryID = d.CategoryID;
    this.BrandID = e.BrandID;
    this.ViewProductsByCategoryandBrand();
  }

  CategoryID:number=0;
  BrandID:number=0;
  lstProductsDetbycat:any=[];
  ViewProductsByCategoryandBrand(){
 
    this.apiCall.DBCalling("ViewProductsBycategoryandbrand",'',(+this.CategoryID),(+this.BrandID),"").subscribe(
      async (res) => {
     
        let lstProd:any= (res);
        this.lstProductsDetbycat = lstProd.tasks[0];
        if(lstProd.tasks.length!=0){
          for(var i=0;i<this.lstProductsDetbycat.length;i++){
            if(this.lstProductsDetbycat.length>0){
              this.router.navigate(
                ['/ProductSearchAndFilter'],
                { queryParams: { Type:'Product' , ID:this.lstProductsDetbycat[i].ProductID} }
              );
            }
          }
        }else{
          var filter=this.lstCategoriesDet.filter(x=>x.CategoryID==this.CategoryID && x.BrandID==this.BrandID);
          if(filter.length==0){
         
            this.router.navigate(
              ['/ProductSearchAndFilter'],
              { queryParams: { Type: 'category', ID:this.CategoryID,Name:'',Img:''} }
            );
          //  this.router.navigate(
          //   ['/ProductSearchAndFilter'],
          //   { queryParams: { Type: 'Brand', ID:this.BrandID,Name:'',Img:'',CategoryId:this.CategoryID} }
          // );
          }else{
         
          
          }
        
       
        }
       
      });
  }

  loginmodaldisplay = 'none';

  closeLoginModal(){
    this.loginmodaldisplay = 'none';
  }

  registrationshow = false;
  login = true;
  registrationClick(){
 
    this.submitted = false;
    this.registrationshow = true;
    this.login = false;
  }

  logindetshowClick(){
 
    this.submited = false;
    this.registrationshow = false;
    this.login = true;
  }

  validateEmail(input:any):boolean
  {
      var regexp=new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      var res= regexp.test(input)
      return res;
  }
  validateTenDigitNumber(number) {

    // Define regex pattern for 10-digit number
    const pattern = /^\d{10}$/; // Assumes number should be exactly 10 digits
  
    // Test the number against the regex pattern
    
    return pattern.test(number);
  }
  
  validateMobile(input:any):boolean
  {
  var regexp=new RegExp(/^[6-9]\d{9}$/);
    var res= regexp.test(input)
   return res;
  }
  
  email:string="";
  password:string="";
  submited = false;
  dbResult:any;
  lstParentCategory:any=[];
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
  SharePath:string='';
  redirectto(type)
{
  switch(type)
  {
case 'Twitter':
{
  window.open("https://twitter.com/share?url=" + encodeURIComponent(this.SharePath), "_blank", "height=400,width=550");

  break;
}

case 'Facebook':
{
  window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(this.SharePath), "_blank", "height=400,width= 550");


  break;
}

case 'Whatsapp':
{
  window.open("https://web.whatsapp.com/send?text=" + encodeURIComponent(this.SharePath), "_blank" , "height=400,width= 550");


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
  Login()
{
  
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
 
    this.apiCall.DBCalling("UserLogin",this.email,this.password,"","").subscribe(
      (res:any) => 
      {
        
    
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

        let cartlst= typeof(this.getCartdetails())=='undefined' ? [] : this.getCartdetails();
     
        if(typeof(cartlst[0])!='undefined' && cartlst[0].lstCartList.length>0){
          this.loginmodaldisplay='none';
          this.checkoutClick()
        }else{
          window.location.reload();
        
          // this.router.navigateByUrl('/home')
          // .then(() => {
          //   window.location.reload();
          // });
          
        } 
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

validateUserRegistration():boolean
{
  debugger;
  var validate:boolean=true;

  if(this.registration.UserFirstName=='')
  {
  validate =false;
  }
  debugger;
  if(this.registration.UserLastName=='' && validate)
  {
  validate =false;
  }
  debugger;
  if(this.registration.UserAddress=='' && validate)
  {
  validate =false;
  }
  debugger;
  if(this.registration.UserZip=='' && validate)
  {
  validate =false;
  }

  var valEmail=this.validateEmail(this.registration.UserEmail);

  if((this.registration.UserEmail==''|| (valEmail!=true))&& validate)
  {
  validate =false;
  }
  debugger;
  if(this.registration.UserMobile=='' && validate)
  {
  validate =false;
  }
  debugger;
 // var valPhone = this.validateMobile(this.registration.UserMobile);
//  || (valPhone!=true)
  if((this.registration.UserMobile=='')&& validate)
  {
  validate =false;
  }
  debugger;
  if(this.registration.UserPassword=='' && validate)
  {
  validate =false;
  }
  debugger;
  if(this.registration.UserCountry=='' && validate)
  {
  validate =false;
  }
  debugger;
  if(this.registration.UserState=='' && validate)
  {
  validate =false;
  }
  debugger;
  if(this.registration.UserCity=='' && validate)
  {
  validate =false;
  }
  debugger;
  return  validate;
}
  submitted = false;
saveUserDetails()
{
  debugger;
  this.submitted = true;
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

  this.apiCall.DBCalling("SaveRegistaration",xml1,"","","").subscribe(
    async (res) => {
      debugger;
      let brnadResult:any= (res);
  
      if(brnadResult.tasks.length>0 ){
        let i=0;
      if(brnadResult.tasks[i][0].DBresult=='-3' )
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
        this.userName=(this.registration.UserFirstName+this.registration.UserLastName) ;       
        this.loginUserDetails.UserLastName=this.registration.UserLastName;
        this.loginUserDetails.UserCity=this.registration.UserCity;
        this.loginUserDetails.UserState=this.registration.UserState;
        this.loginUserDetails.UserZip=this.registration.UserZip;
        this.loginUserDetails.UserCountry=this.registration.UserCountry;
        this.loginUserDetails.UserAddress=this.registration.UserAddress;
        this.loginUserDetails.UserMobile=this.registration.UserMobile;
        this.store.dispatch(new  PageStore.OpenPage(this.loginUserDetails));
        let cartlst= typeof(this.getCartdetails())=='undefined' ? [] :this.getCartdetails();
        //console.log(cartlst)
        
        if(typeof(cartlst[0])!='undefined'  && cartlst[0].length>0  ){
          
          this.loginmodaldisplay='none';
          this.checkoutClick()
        }else{
          this.loginmodaldisplay='none';
      
          this.router.navigateByUrl('/home')
        }
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
}