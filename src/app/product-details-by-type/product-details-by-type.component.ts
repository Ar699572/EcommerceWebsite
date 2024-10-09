import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { APICallingService } from '../model/APICallingService';
import { AppSettings, IAppSettings } from '../model/AppSettings';

@Component({
  selector: 'app-product-details-by-type',
  templateUrl: './product-details-by-type.component.html',
  styleUrls: ['./product-details-by-type.component.css']
})
export class ProductDetailsByTypeComponent implements OnInit {
  ParentData:any;
  hover:boolean=false;
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
  constructor(private route: ActivatedRoute, private apiCall:APICallingService,private store: Store<any>,public router:Router,public appSettings:AppSettings) { 

    this.storeSettings=   this.appSettings.loadSettings();
    this.ImagePath=this.storeSettings.apiCallingUrl;
    // this.ParentData= this.router.getCurrentNavigation().extras.state;
    // if(this.ParentData!=null && typeof(this.ParentData)!='undefined'  &&  typeof(this.ParentData.ID)!='undefined')
  
    // {

    //   this.type=this.ParentData.Type;
    //   this.id=this.ParentData.ID;
      
    //   this. ViewProductDetByType();
    // }


  }
  selectedProductOptions=[];

  prepareOptionsString(selectedProductOptions)
  {
    this.selectedProductOptions=[];
    //debugger;
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
    //debugger;
    const array = selectedProductOptions.map(item => ( item.OptionGroupName ==Options[i]?item.OptionName:null));
    const filteredArray = array.filter(value => value !== null && value !== undefined);
    const result = filteredArray.join(',');
  if(result!='')
  {
    this.selectedProductOptions.push({'Name':Options[i],'Options':result});
  }
  }
    
    
  
  
  }
  ProductClick(ProductOptionID,ProductID,ProductImage)
{
  
//this.router.navigateByUrl('/ProductDetails', { state: { OptionID:ProductOptionID , ID:ProductID,Img:ProductImage} });
this.router.navigate(['/ProductDetails'], { queryParams: {  OptionID:ProductOptionID,ID:ProductID,Img:ProductImage} });
}
  async productMouseOverCall(productId)
{
//debugger;

await this.apiCall.DBCalling("GetProductOptionsShortDetByProductId",productId,"","","").subscribe(
  async (res) => {
    //debugger;
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
  type="";
  id="";
  searchText='';
  ngOnInit(): void {

    try{
      this.route.queryParamMap
      .subscribe((params:any) => {
        debugger;
  
   this.type=params.params.Type;
      this.id=params.params.ID;
      
      this. ViewProductDetByType();


        
      });
  
    }catch(e)
    {
  
    }
  }
  lstProducts=[];
  lstFilteredProducts=[];

  ViewProductDetByType()
   {
    
 $("#preloader").show();
    
    debugger;
    this.apiCall.DBCalling("ViewProductDetByType",this.type,this.id,this.searchText,"").subscribe(
    (res) => {
      debugger;
      let dbResult:any= (res);
      this.lstProducts=[];
      if(dbResult.tasks.length>0 && dbResult.tasks[0].length>0 )
      {
        
        this.lstProducts=dbResult.tasks[0];
        this.lstFilteredProducts=this.lstProducts;
     


      }
      else{

        $("#preloader").hide();
        this.router.navigateByUrl('/ProductNotFound', { state: { SearchText:this.searchText} });
      }
      $("#preloader").hide();
    
    });

   }
}
