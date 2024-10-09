import { Component, Input, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APICallingService } from '../model/APICallingService';
import { AppSettings, IAppSettings } from '../model/AppSettings';
import * as $ from 'jquery'

@Component({
  selector: 'app-product-search-and-filter',
  templateUrl: './product-search-and-filter.component.html',
  styleUrls: ['./product-search-and-filter.component.css']
})
export class ProductSearchAndFilterComponent implements OnInit {
  Type="";
  ID="";
  SearchText="";
  hover=false;
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
  SortChange(target)
{
;

if(target.value=='Dafault')
  {
    this.lstFilteredProducts=this.lstFProducts;
  }
  if(target.value=='Price Low to High')
  {


 this.lstFilteredProducts .sort(function(obj1, obj2) {
      // Ascending: first age less than the previous
      return (+obj1.SalesPrice) - (+obj2.SalesPrice);
    });

  }

  if(target.value=='Price High to Low')
  {
  this.lstFilteredProducts .sort((obj1, obj2) =>{
    // Ascending: first age less than the previous
 //   return obj1.SalesPrice - obj2.SalesPrice;

    if ((+obj1.SalesPrice) > (+obj2.SalesPrice)) {
      return -1;
  }

  if ((+obj1.SalesPrice) < (+obj2.SalesPrice)) {
      return 1;
  }

  return 0;



  });
}

  if(target.value=='Name (A-Z)')
  {


 this.lstFilteredProducts .sort((obj1, obj2) =>{
      // Ascending: first age less than the previous
   //   return obj1.SalesPrice - obj2.SalesPrice;

      if (obj1.ProductName > obj2.ProductName) {
        return 1;
    }

    if (obj1.ProductName < obj2.ProductName) {
        return -1;
    }

    return 0;



    });





    
    

  }
  if(target.value=='Name (Z-A)')
  {


 this.lstFilteredProducts .sort((obj1, obj2) =>{
      // Ascending: first age less than the previous
   //   return obj1.SalesPrice - obj2.SalesPrice;

      if (obj1.ProductName > obj2.ProductName) {
        return -1;
    }

    if (obj1.ProductName < obj2.ProductName) {
        return 1;
    }

    return 0;



    });

  }


}




  ImagePath='';
  constructor(private route: ActivatedRoute,private ngZone:NgZone, private router:Router,private APICall:APICallingService,public appSettings:AppSettings) {

    this.storeSettings=   this.appSettings.loadSettings();
    this.ImagePath=this.storeSettings.apiCallingUrl;  
    
    
    
       }
       selectedProductOptions=[];

       prepareOptionsString(selectedProductOptions)
       {
      

         this.selectedProductOptions=[];
            
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
      
         const array = selectedProductOptions.map(item => ( item.OptionGroupName ==Options[i]?item.OptionName:null));
         const filteredArray = array.filter(value => value !== null && value !== undefined);
         const result = filteredArray.join(',');
       if(result!='')
       {
         this.selectedProductOptions.push({'Name':Options[i],'Options':result});
       }
       }
         
         
       
       
       }

OptionsChange(target,data,OptionGroupID)
{
debugger;

  
  if(target.checked==true)
  {
  
    this.chklstOptions.push({'OptionID':data.OptionID,'OptionGroupID':OptionGroupID})
  }else{
    for(let i=0;i<this.chklstOptions.length;i++)
    {
      if(this.chklstOptions[i].OptionID==data.OptionID)
      {
        this.chklstOptions.splice(i, 1);
        i=i-1;
      }
    }
   
    
  }
  
  
  this.ngZone.run(() => this.FilterData());

}

       async productMouseOverCall(productId)
       {
     ;
       
       await this.APICall.DBCalling("GetProductOptionsShortDetByProductId",productId,"","","").subscribe(
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


       lstResultCategories:any=[];
       lstResultOptions:any=[];
       lstResultOptionGroups:any=[];
       lstResultBrands:any=[];
       chklstPrice:any=[{min:0,max:1000,index:1},{min:1001,max:2000,index:2},{min:2001,max:3000,index:3},{min:3001,max:4000,index:4},{min:4001,max:5000,index:5}];
       chklstOptions:any=[];
       lstFilteredProducts:any=[];
       chklstCategories:any=[];
       chklstBrands:any=[];
       lstProducts=[];
      
       lstFProducts:any=[];
       ViewProductDetByType()
       {
        debugger
        $("#preloader").show();
        try{
          
        this.APICall.DBCalling("ViewProductDetByType",this.Type,this.ID,this.SearchText,"").subscribe(
        (res) => {
         
          let Result:any= (res);
          this.lstProducts=null;
          if(Result.tasks.length>0 && Result.tasks[0].length>0 )
          {
            
            this.lstProducts=Result.tasks[0];
            this.lstFilteredProducts=this.lstProducts;
            console.log(this.lstFilteredProducts)
            this.lstFProducts=this.lstProducts;
       
    for(let j=0;j<this.lstProducts.length;j++)
    {
    
      if(this.lstofResultMainCategories.length==0){
        this.lstofResultMainCategories.push({'MnCategoryname':this.lstProducts[j].MnCategoryname,'MnCategoryId':this.lstProducts[j].ParentCategoryId,'show':true})
        this.chklstMnCategories.push({'MnCategoryID':this.lstProducts[j].ParentCategoryId})
      }else{
      
        var filter=this.lstofResultMainCategories.filter(x=>x.MnCategoryname==this.lstProducts[j].MnCategoryname);
        if(filter.length>0){}else{ 
          this.chklstMnCategories.push({'MnCategoryID':this.lstProducts[j].ParentCategoryId})
          this.lstofResultMainCategories.push({'MnCategoryname':this.lstProducts[j].MnCategoryname,'MnCategoryId':this.lstProducts[j].ParentCategoryId,'show':true})}
      }
   
      if(this.lstResultCategories.some(lstResultCategories => lstResultCategories.Categoryname ===this.lstProducts[j].Categoryname)){
       
    } else{
      // this.lstResultCategories.push({'Categoryname':this.lstProducts[j].Categoryname,'CategoryID':this.lstProducts[j].CategoryID});
   
      this.lstResultCategories.push({'Categoryname':this.lstProducts[j].Categoryname,'CategoryID':this.lstProducts[j].CategoryID,'MnCategoryID':this.lstProducts[j].ParentCategoryId,'show':true});
      this.chklstCategories.push({'CategoryID':this.lstProducts[j].CategoryID,'MnCategoryID':this.lstProducts[j].ParentCategoryId})
    }
    


    if(this.lstResultBrands.some(lstResultBrands => lstResultBrands.BrandName ===this.lstProducts[j].BrandName)){
       
    } else{
      this.lstResultBrands.push({'BrandName':this.lstProducts[j].BrandName,'BrandID':this.lstProducts[j].BrandID});


      this.chklstBrands.push({'BrandID':this.lstProducts[j].BrandID})
    }
    

    
    
    if(this.lstProducts[j].OPGName1!='')
    {
      
    
    this.lstResultOptionGroups.push({'OptionGroup':this.lstProducts[j].OPGName1,'OptionGroupID':this.lstProducts[j].OptionGroupID});

    this.lstResultOptions.push({'OptionName':this.lstProducts[j].OPName1,'OptionGroupID':this.lstProducts[j].OptionGroupID,'OptionID':this.lstProducts[j].OptionID});
    this.chklstOptions.push({'OptionID':this.lstProducts[j].OptionID,'OptionGroupID':this.lstProducts[j].OptionGroupID})
   
  
  }
    if(this.lstProducts[j].OPGName2!='')
    {
      
    this.lstResultOptionGroups.push({'OptionGroup':this.lstProducts[j].OPGName2,'OptionGroupID':this.lstProducts[j].OptionGroup1ID});
    
    this.lstResultOptions.push({'OptionName':this.lstProducts[j].OPName2,'OptionGroupID':this.lstProducts[j].OptionGroup1ID,'OptionID':this.lstProducts[j].Option1ID});
    this.chklstOptions.push({'OptionID':this.lstProducts[j].Option1ID,'OptionGroupID':this.lstProducts[j].OptionGroup1ID})
   
  }
    if(this.lstProducts[j].OPGName3!='')
    {
      
    this.lstResultOptionGroups.push({'OptionGroup':this.lstProducts[j].OPGName3,'OptionGroupID':this.lstProducts[j].OptionGroup2ID});
    
    this.lstResultOptions.push({'OptionName':this.lstProducts[j].OPName3,'OptionGroupID':this.lstProducts[j].OptionGroup2ID,'OptionID':this.lstProducts[j].Option2ID});
    this.chklstOptions.push({'OptionID':this.lstProducts[j].Option2ID,'OptionGroupID':this.lstProducts[j].OptionGroup2ID})
    
  }
    if(this.lstProducts[j].OPGName4!='')
    {
      
    this.lstResultOptionGroups.push({'OptionGroup':this.lstProducts[j].OPGName4,'OptionGroupID':this.lstProducts[j].OptionGroup3ID});
    
    this.lstResultOptions.push({'OptionName':this.lstProducts[j].OPName4,'OptionGroupID':this.lstProducts[j].OptionGroup3ID,'OptionID':this.lstProducts[j].Option3ID});
    this.chklstOptions.push({'OptionID':this.lstProducts[j].Option3ID,'OptionGroupID':this.lstProducts[j].OptionGroup3ID})
    
  }
    
    if(this.lstProducts[j].OPGName5!='')
    {
    this.lstResultOptionGroups.push({'OptionGroup':this.lstProducts[j].OPGName5,'OptionGroupID':this.lstProducts[j].OptionGroup4ID});
    this.lstResultOptions.push({'OptionName':this.lstProducts[j].OPName5,'OptionGroupID':this.lstProducts[j].OptionGroup4ID,'OptionID':this.lstProducts[j].Option4ID});
    this.chklstOptions.push({'OptionID':this.lstProducts[j].Option4ID,'OptionGroupID':this.lstProducts[j].OptionGroup4ID})
   
  }
    
    if(this.lstProducts[j].OPGName6!='')
    {
    this.lstResultOptionGroups.push({'OptionGroup':this.lstProducts[j].OPGName6,'OptionGroupID':this.lstProducts[j].OptionGroup5ID});
    
    this.lstResultOptions.push({'OptionName':this.lstProducts[j].OPName6,'OptionGroupID':this.lstProducts[j].OptionGroup5ID,'OptionID':this.lstProducts[j].Option5ID});
   this.chklstOptions.push({'OptionID':this.lstProducts[j].Option5ID,'OptionGroupID':this.lstProducts[j].OptionGroup5ID})

    
  }
    }


    
          }
          else{
    
            $("#preloader").hide();
           
          }
          $("#preloader").hide();
          this.LoadCatgeory(this.CategoryId)
        });
      }catch(e)
      {
     
        $("#preloader").hide();
      
      }
       }
       getMainCategoryByProducts(lstofproduct,categoryId){
      
        
        
       }
       LoadCatgeory(CategoryId){
      
        switch (CategoryId) {
          case 0:
              
              break;
              case undefined:
              
              break;
          default:
           if(this.chklstCategories.length>0){
           for(let i=0;i<this.chklstCategories.length;i++){
          
              if(this.chklstCategories[i].CategoryID==CategoryId){

              }else{
              
                this.chklstCategories.splice(i,1);
                i=i-1;
                
              }
              
           }

           for(let j=0;j<this.lstResultCategories.length;j++){
            if(this.lstResultCategories[j].CategoryID==CategoryId){

            }else{
            
             
              this.lstResultCategories[j].show=false;
            }
           }
           this.ngZone.run(() => this.FilterData());
          }
            
              break;
      }
      
       }
       BrandChange(target,data)
       {
       
       if(target.checked==true)
       {
       
         this.chklstBrands.push({'BrandID':data.BrandID})
       }else{
       
       
         for(let i=0;i<this.chklstBrands.length;i++)
           {
             if(this.chklstBrands[i].BrandID==data.BrandID)
             {
               this.chklstBrands.splice(i, 1);
               i=i-1;
             }
           }
       }
       this.ngZone.run(() => this.FilterData());
       }
     
       CategoriesChange(target,data)
       {
     
       if(target.checked==true)
       {
        
         this.chklstCategories.push({'CategoryID':data.CategoryID})
       }else{
        
       
         for(let i=0;i<this.chklstCategories.length;i++)
           {
            
             if(this.chklstCategories[i].CategoryID==data.CategoryID)
             {
              
               this.chklstCategories.splice(i, 1);
               i=i-1;
             }
           }
       }
       this.ngZone.run(() => this.FilterData());
       }
       FilterPrice(lstFProducts)
{


  var ShowAllData=true;

  if(this.chklstPrice.length==0)
  {
    ShowAllData=false;
  }
  for(let p=0;p<lstFProducts.length;p++)
  {
  
  
    if( typeof(this.chklstPrice)!='undefined'&& this.chklstPrice!=null && this.chklstPrice.length>0)
    {
    for(let pr=0;pr<this.chklstPrice.length;pr++)
    {
      this.SAllData=false;
      ShowAllData=false;
          if(((+lstFProducts[p].SalesPrice)>((+this.chklstPrice[pr].min)-1))  && ((+lstFProducts[p].SalesPrice)<((+this.chklstPrice[pr].max)+1)) )
          {
          lstFProducts[p].Show=true;
  
          }
  
  
  
  }
  }
  else{
    lstFProducts[p].Show=false;
  }
  }  


  if(ShowAllData==false)
  {
  
  
for(let p=0;p<lstFProducts.length;p++)
{
if(lstFProducts[p].Show==false)
{
  lstFProducts.splice(p,1)
  p=p-1;
}

}

  }

  return lstFProducts;
}
lstofResultMainCategories:any=[];





MainCategoryChange(target,data,index){
debugger
if(target.checked==true){
  this.lstofResultMainCategories[index].show=true;
  this.chklstMnCategories.push({'MnCategoryID':data.MnCategoryId})
  
}else{
  this.lstofResultMainCategories[index].show=false;
  for(let i=0;i<this.chklstMnCategories.length;i++)
  {
    if(this.chklstMnCategories[i].MnCategoryID==data.MnCategoryId)
    {
      this.chklstMnCategories.splice(i, 1);
      i=i-1;
    }
  }

  // for(let i=0;i<this.chklstCategories.length;i++)
  // {
  //   if(this.chklstCategories[i].MnCategoryID==data.MnCategoryId)
  //   {
  //     this.chklstCategories.splice(i, 1);
  //     i=i-1;
  //   }
  // }
  // for(let i=0;i<this.lstResultCategories.length;i++)
  // {
  //   if(this.lstResultCategories[i].MnCategoryID==data.MnCategoryId)
  //   {
  //     this.lstResultCategories[i].show=false;
     
  //   }
  // }
  
  
}
this.ngZone.run(() => this.FilterData());
}
FilterBrand(lstFProducts)
{
  ;
  
  var ShowAllData=true;
  if(this.chklstBrands.length==0)
  {
    ShowAllData=false;
  }
  for(let p=0;p<lstFProducts.length;p++)
  {
    if( typeof(this.chklstBrands)!='undefined'&& this.chklstBrands!=null && this.chklstBrands.length>0)
    {
    for(let pr=0;pr<this.chklstBrands.length;pr++)
    {
      this.SAllData=false;
      ShowAllData=false;
          if(lstFProducts[p].BrandID==this.chklstBrands[pr].BrandID )
          {
            lstFProducts[p].Show=true;
  
  
          }
        }
      }
      else{
        lstFProducts[p].Show=false;
      }
    }
    if(ShowAllData==false)
    {
    
    
  for(let p=0;p<lstFProducts.length;p++)
  {
  if(lstFProducts[p].Show==false)
  {
    lstFProducts.splice(p,1);
    p=p-1;
  }
  
  }
  
    }
  return lstFProducts;

}

min1=0;
min2=1001;
min3=2001;
min4=3001;
min5=4001;


max1=1000;
max2=2000
max3=3000;
max4=4000;
max5=5000;

Smin1=0;
Smin2=0;
Smin3=0;
Smin4=0;

Smax1=0;
Smax2=0
Smax3=0;
Smax4=0;
value_min=0;
value_max=5000;
addrange(target,min,max,index){

  

if(target.checked==true){
  this.chklstPrice.push({'min':min,'max':max,'index':index});
  var values = this.chklstPrice.map(obj => obj.min);
  var values2 = this.chklstPrice.map(obj => obj.max);
  var minValue1 = Math.min(...values);
  var maxValue2 = Math.max(...values2);
  this.MinValue=typeof(minValue1)==undefined? 0 :minValue1;
  this.MaxValue=typeof(maxValue2)==undefined? 0 :maxValue2;
  var displayele1 = this.parent.getElementsByClassName("amount-range-price mt-5")[0];
  displayele1.innerHTML = " Range From ₹" + this.MinValue + " -  ₹" + this.MaxValue;
}else{
  var relindex =this.chklstPrice.findIndex(x => x.index ===index);
  if(relindex!=-1){
      this.chklstPrice.splice(relindex,1)
     }
     if(this.chklstPrice.length!=0){
      var values = this.chklstPrice.map(obj => obj.min);
      var values2 = this.chklstPrice.map(obj => obj.max);
      var minValue1 = Math.min(...values);
      var maxValue2 = Math.max(...values2);
      this.MinValue=minValue1;
      this.MaxValue=maxValue2;
     }else{
      this.MinValue=0;
      this.MaxValue=0;
     }
     var displayele1 = this.parent.getElementsByClassName("amount-range-price mt-5")[0];
      displayele1.innerHTML = " Range From ₹" + this.MinValue + " -  ₹" + this.MaxValue;
    
}
this.ngZone.run(() => this.FilterData());

}
PriceRange(target,min,max,index){
 var mmin,mmax
if(target.checked==true){
  this.chklstPrice.push({'min':min,'max':max,'index':index});
}else{
;
var RemoveIndex = this.chklstPrice.findIndex(x => x.index ===index);
var RIndex = this.chklstPrice.findIndex(x => x.index ===1);
if(RIndex!=-1){
    this.chklstPrice.splice(RIndex,1)
}
this.chklstPrice.splice(RemoveIndex,1)
var len=this.chklstPrice.length;
mmin=this.chklstPrice[0].min;
mmax=this.chklstPrice[len-1].max;
this.MinValue=mmin;
this.MaxValue=mmax;


}

//(window as any).jQuery('.slider-range-price').slider('refresh');
this.ngZone.run(() => this.FilterData());
// this.FilterData();

}
chklstMnCategories:any=[];
FilterCategory(lstFProducts)
{

  var ShowAllData=true;
if(this.chklstCategories.length==0)
{
  ShowAllData=false;
}
  
  for(let p=0;p<lstFProducts.length;p++)
  {
    if( typeof(this.chklstCategories)!='undefined'&& this.chklstCategories!=null && this.chklstCategories.length>0)
    {
    for(let pr=0;pr<this.chklstCategories.length;pr++)
    {
      this.SAllData=false;
      ShowAllData=false;
          if(lstFProducts[p].CategoryID==this.chklstCategories[pr].CategoryID )
          {
  
            lstFProducts[p].Show=true;
  
  
          }
        }
      }
      else{
        lstFProducts[p].Show=false;
      }
    }
    if(ShowAllData==false)
    {
    
    
  for(let p=0;p<lstFProducts.length;p++)
  {
  if(lstFProducts[p].Show==false)
  {
    lstFProducts.splice(p,1);
    p=p-1;
  }
  
  }
  
    }
  return lstFProducts;

}
// FilterCategory(lstFProducts)
// {
// 
//   var ShowAllData=true;
// if(this.chklstCategories.length==0)
// {
//   ShowAllData=false;
// }
  
//   for(let p=0;p<lstFProducts.length;p++)
//   {
    
//     if( typeof(this.chklstCategories)!='undefined'&& this.chklstCategories!=null && this.chklstCategories.length>0)
//     {
      
//     for(let pr=0;pr<this.chklstCategories.length;pr++)
//     {
      
//       this.SAllData=false;
//       ShowAllData=false;
//           if(lstFProducts[p].CategoryID==this.chklstCategories[pr].CategoryID )
//           {
            
//             var filters=lstFProducts.filter(x=>x.CategoryID==this.chklstCategories[pr].CategoryID);
//             if(filters.length>0){
//               lstFProducts[p].Show=true;
//               this.lstFilteredProducts.push(lstFProducts[p]);
              
//             }else{
              
//             }
//             // if(this.lstFilteredProducts.some(lstFilteredProducts => lstFilteredProducts.CategoryID ===lstFProducts[p].CategoryID)){
     
//             // } else{
//             //   this.lstFilteredProducts.push(lstFProducts[p]);
//             // }
  
  
         
  
  
//           }
//         }
//       }
//       else{
//         lstFProducts[p].Show=false;
//       }
//     }
//     if(ShowAllData==false)
//     {
    
    
//   for(let p=0;p<lstFProducts.length;p++)
//   {
//   if(lstFProducts[p].Show==false)
//   {
//     lstFProducts.splice(p,1);
//     p=p-1;
//   }
  
//   }
  
//     }
//   return lstFProducts;

// }
FilterOption(lstFProducts,OptionGroupID)
{

  var ShowAllData=true;
  if(this.chklstOptions.length==0 || lstFProducts.length==0)
  {
    ShowAllData=false;
    return lstFProducts=[];
  }



  
  if(typeof(this.chklstOptions)!='undefined'&& this.chklstOptions!=null && this.chklstOptions.length>0)
  {
  for(let pr=0;pr<this.chklstOptions.length;pr++)
  {

if(  this.chklstOptions[pr].OptionGroupID==OptionGroupID)
  {
    for(let p=0;p<lstFProducts.length;p++)
  {
    ShowAllData=false;
    this.SAllData=false;


        if(((lstFProducts[p].OptionID==this.chklstOptions[pr].OptionID && lstFProducts[p].OptionGroupID==OptionGroupID)
         || (lstFProducts[p].Option1ID==this.chklstOptions[pr].OptionID && lstFProducts[p].OptionGroup1ID==OptionGroupID) 
         
         || (lstFProducts[p].Option2ID==this.chklstOptions[pr].OptionID && lstFProducts[p].OptionGroup2ID==OptionGroupID ) 
         || (lstFProducts[p].Option3ID==this.chklstOptions[pr].OptionID && lstFProducts[p].OptionGroup3ID==OptionGroupID) 
         || (lstFProducts[p].Option4ID==this.chklstOptions[pr].OptionID && lstFProducts[p].OptionGroup4ID==OptionGroupID) 
         || (lstFProducts[p].Option5ID==this.chklstOptions[pr].OptionID && lstFProducts[p].OptionGroup5ID==OptionGroupID) 
         
         
         ))
        {



          lstFProducts[p].Show=true;
         


        }


}
}
  }

if(ShowAllData==false)
{
  for(let p=0;p<this.lstFProducts.length;p++)
  {
  if(this.lstFProducts[p].Show==false)
  {
    this.lstFProducts.splice(p,1);
    p=p-1;
  }
  
  }

}else{
  lstFProducts=[];
}


  ShowAllData=true;
  }

  
  return lstFProducts;
}

      
       SAllData=true;
      
       FilterData()
       {
   
          this.SAllData=true;
         $("#preloader").show();
          this.lstFilteredProducts=[];
           this.lstFProducts=[];
           this.lstFProducts=this.lstProducts;
       
          var  data = $.map(this.lstFProducts , function (obj) {
          
           obj.Show = false; 
          
           return obj;
         });
         
         this.lstFProducts=data;

       this.lstFProducts=this.filterProductsByPrice(this.MinValue,this.MaxValue)
        this.lstFProducts=this.filterMaincategory(this.lstFProducts)
          for(let p=0;p<this.lstFProducts.length;p++)
          {
          
           this.lstFProducts[p].Show = false; 
          
          
          }
        
          this.lstFProducts=this.FilterCategory(this.lstFProducts);
       
         
          for(let p=0;p<this.lstFProducts.length;p++)
          {
          
           this.lstFProducts[p].Show = false; 
          
          
          }
          this.lstFProducts=this.FilterBrand(this.lstFProducts);
         // this.lstFProducts=this.FilterColor(this.lstFProducts);


          for(let p=0;p<this.lstFProducts.length;p++)
          {
          
           this.lstFProducts[p].Show = false; 
          
          
          }
          





          
       
          const distinctThings = this.lstResultOptionGroups.filter(
           (thing, i, arr) => arr.findIndex(t => t.OptionGroupID === thing.OptionGroupID) === i
         );
         
         //var lstOpProducts:any=[];
          for(let pr=0;pr<distinctThings.length;pr++)
          {
        
       
           this.lstFProducts=this.FilterOption(this.lstFProducts,distinctThings[pr].OptionGroupID);
       
           
           
           for(let p=0;p<this.lstFProducts.length;p++)
           {
           
         this.lstFProducts[p].Show=false;
           
           }
           }
           
          this.lstFilteredProducts=this.lstFProducts;
      
         
         $("#preloader").hide();
         
       }
       FilterColor(lstProducts){
       
        var filter:any=[];
        if(this.chklstOptions.length>0){
          for(let i=0;i<this.chklstOptions.length;i++){
            
            filter=lstProducts.filter(x=>x.MnCategoryID==this.chklstOptions[i].MnCategoryID);
            return filter;
          }
          }else{
            return filter;
          }
       }

       filterMaincategory(lstProducts){
      
        // var filter:any=[];
        // // if(this.lstofResultMainCategories.length>0){
        // //   for(let i=0;i<this.lstofResultMainCategories.length;i++){
        // //     filter=lstProducts.filter(x=>x.MnCategoryID==this.lstofResultMainCategories[i].MnCategoryID && this.lstofResultMainCategories[i].show);
        // //     return filter;
        // //   }
        // //   }else{
        // //     return filter;
        // //   }
      
        var ShowAllData=true;
      if(this.chklstMnCategories.length==0)
      {
        ShowAllData=false;
      }
        
        for(let p=0;p<lstProducts.length;p++)
        {
          if( typeof(this.chklstMnCategories)!='undefined'&& this.chklstMnCategories!=null && this.chklstMnCategories.length>0)
          {
          for(let pr=0;pr<this.chklstMnCategories.length;pr++)
          {
            this.SAllData=false;
            ShowAllData=false;
                if(lstProducts[p].MnCategoryID==this.chklstMnCategories[pr].MnCategoryID )
                {
        
                  lstProducts[p].Show=true;
        
        
                }
              }
            }
            else{
              lstProducts[p].Show=false;
            }
          }
          if(ShowAllData==false)
          {
          
          
        for(let p=0;p<lstProducts.length;p++)
        {
        if(lstProducts[p].Show==false)
        {
          lstProducts.splice(p,1);
          p=p-1;
        }
        
        }
        
          }
        return lstProducts;
        }
      
       filterProductsByPrice(minPrice, maxPrice) {
        
        var filteredProducts = this.lstFProducts.filter(function(product) {
          return product.SalesPrice >= minPrice && product.SalesPrice <= maxPrice;
        });
        return filteredProducts;
      }
    
     
       ProductClick(ProductOptionID,ProductID,ProductImage,option2,option3)
       {
      debugger;
   
        this.router.navigate(
          ['/ProductDetails'],
          { queryParams:{ OptionID:ProductOptionID , ID:ProductID,Img:ProductImage,option2:option2,option3:option3}  }
        );
        
     
       }
CategoryId:number=0;

  ngOnInit(): void {
  
try{
  
    this.route.queryParamMap
    .subscribe((params:any) => {
debugger;
      this.Type=params.params.Type;
      this.ID=params.params.ID;
      this.CategoryId=typeof(params.params.CategoryId)=='undefined' ? 0 :params.params.CategoryId;
      this.ngZone.run(() => {
      
        this.ngAfterViewInit();
        this.ViewProductDetByType();
       
        
      }
        );
      
      
     

      this.router.routeReuseStrategy.shouldReuseRoute = function(){
        return false;
      } 
      
    });
    

    
   
  }catch(e)
  {

  }
  
  }

  setVals(slides1,slides2){
    // Get slider values;
   
    let slides = this.parent.getElementsByTagName("input");

    slides[0].value=slides1;
    slides[1].value=slides2;
      let slide1 = parseFloat( slides[0].value );
      let slide2 = parseFloat( slides[1].value );
    // Neither slider will clip the other, so make sure we determine which is larger
    if( slide1 > slide2 ){ let tmp = slide2; slide2 = slide1; slide1 = tmp; }
    
    let displayElement = this.parent.getElementsByClassName("amount-range-price mt-5")[0];
        displayElement.innerHTML = " Range From ₹" + slide1 + " -  ₹" + slide2;
  }
  

  parent:any;
  sliderSections:any;
  @Input()
  set searchFilter(val) {
    
   
    this.lstFilteredProducts=Object.assign([],val.tasks[0])


  }
  MinValue=0;
  MaxValue=5000;
  ngAfterViewInit()
  { 
 
  
    var that=this;
    //that.chklstPrice=[];
    $(function() {
    
    function getVals(){
      // Get slider values
      that.parent = this.parentNode;
       let slides = that.parent.getElementsByTagName("input");
      ;
      
        let slide1 = parseFloat( slides[0].value );
        let slide2 = parseFloat( slides[1].value );

      
      // Neither slider will clip the other, so make sure we determine which is larger
      if( slide1 > slide2 ){ let tmp = slide2; slide2 = slide1; slide1 = tmp; }
      ;
      
      let displayElement = that.parent.getElementsByClassName("amount-range-price mt-5")[0];
          displayElement.innerHTML = "Range From ₹" + slide1 + " -  ₹" + slide2;
          that.value_min=slide1;
          that.value_max=slide2;
          that.MinValue=slide1;
          that.MaxValue=slide2;
         // that.chklstPrice=[];
          
         // that.chklstPrice.push({'min':slide1,'max':slide2,'index':6});
        //  that.FilterData()
          that.ngZone.run(() => that.FilterData());
// this.FilterData();

    }
 
    // window.onload = function(){
      // Initialize Sliders;
      
  
      that.sliderSections = document.getElementsByClassName("slider-container");
          for( let x = 0; x < that.sliderSections.length; x++ ){
            let sliders = that.sliderSections[x].getElementsByTagName("input");
            for( let y = 0; y < sliders.length; y++ ){
              if( sliders[y].type ==="range" ){
                sliders[y].oninput = getVals;
                
                // Manually trigger event first time to display values
                (sliders[y] as any).oninput();
              }
            }
          }
   // }

  });
  window.scrollTo(0,0);
 
  
   
  }

}
