import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { APICallingService } from '../model/APICallingService';
import { AppSettings, IAppSettings } from '../model/AppSettings';

@Component({
  selector: 'app-category-det-by-parent-category',
  templateUrl: './category-det-by-parent-category.component.html',
  styleUrls: ['./category-det-by-parent-category.component.css']
})
export class CategoryDetByParentCategoryComponent implements OnInit {
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
  ImagePath='';
  ParentName='';
  Imagesrc='';
  PCategoryID='0';
  constructor(private route: ActivatedRoute, private apiCall:APICallingService,private store: Store<any>,public router:Router,public appSettings:AppSettings)
   { 
    this.storeSettings=   this.appSettings.loadSettings();
    this.ImagePath=this.storeSettings.apiCallingUrl;

   }
   CategoryClick(res)
   {
 
 var ShowCategory=false;
     for(let i=0;i<this.lstCategories.length;i++)
     {
   if(this.lstCategories[i].ParentCategoryID==res.CategoryID)
   {
 
     ShowCategory=true;
 break;
   }
 
 
     }
 
     if(ShowCategory)
     {

     //this.router.navigateByUrl('/CategoryDetByParentCategory', { state: { ID:res.CategoryID,Name:res.Categoryname,Img:res.BannerImage} });
    
     this.router.navigate(
      ['/CategoryDetByParentCategory'],
      { queryParams:  { ID:res.CategoryID,Name:res.Categoryname,Img:res.BannerImage}}
    );
    
    }else
     {
      this.router.navigate(
        ['/ProductSearchAndFilter'],
        { queryParams: { Type:"Category" , ID:res.CategoryID,Name:res.Categoryname,Img:res.Image} }
      );

       //this.router.navigateByUrl('/ProductDetailsByType', { state: { Type:"Category" , ID:res.CategoryID,Name:res.Categoryname,Img:res.Image} });
     }
 
 
 
 
   }
  ngOnInit(): void {
    try{
      this.route.queryParamMap
      .subscribe((params:any) => {
        debugger;

        this. ViewCategories();
      this.Imagesrc=this.storeSettings.apiCallingUrl.toString()+params.params.Img.toString();
      this.ParentName=params.params.Name.toString();
        this.PCategoryID= params.params.ID;
      

        
      });
  
    }catch(e)
    {
  
    }
  }
  lstChildCategories:any=[];
  lstCategories=[];
  ViewCategories()
  {
   
$("#preloader").show();
   
   debugger;
   this.apiCall.DBCalling("ViewCategories",'','','',"").subscribe(
   (res) => {
     debugger;
     let dbResult:any= (res);
     this.lstCategories=[];
     if(dbResult.tasks.length>0 && dbResult.tasks[0].length>0 )
     {
       
       this.lstCategories=dbResult.tasks[0];
      
       for(let i=0;i<this.lstCategories.length;i++)
       {
         if(this.lstCategories[i].ParentCategoryID==this.PCategoryID)
         {
           if( typeof( this.lstCategories[i].ProductImage)=='undefined')
           {
           
             this.lstCategories[i].ProductImage="";
           }
           this.lstChildCategories.push(this.lstCategories[i]);
   
         }
       }


     }
    
     $("#preloader").hide();
   
   });

  }

}
