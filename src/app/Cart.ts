import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';


@Injectable({
    providedIn: 'root'
})




export class Cart {


    public OrderDatetime;
    public UserID;
    public OrderShipName;
    public DeliveryAddress;
    public City;
    public State;
    public Zip;
    public Country;
    public PhoneNo;
    public OrderTrackingNumber;
    public DeliveryStatus;
    public OrderTax: number;
    public CGSTAmt: number;
    public SGSTAmt: number;
    OrderGrossAmount: number;
    public CouponDiscount: number = 0;
    
    OrderDiscount: number = 0;
    ApplyCouponCode: string= '';
    public DeliveryCharges: number = 0;
   
    public OrderNetTotal: number;
    private TotalSellingPrice;
    private OrderStatus;
    private PaymentMode;
    private PaidStatus;
    private EmailId


    getOrderGrossAmount(): number {
        return this.OrderGrossAmount;
    }

    geTotalDiscount(): number {
        return (+this.OrderDiscount) + (+this.CouponDiscount);
    }

    getOrderDiscount(): number {
        return this.OrderDiscount;
    }

    getDeliveryCharges(): number {
        return this.DeliveryCharges;
    }

    getOrderDiscountAmt(): number {
        return this.OrderGrossAmount - this.OrderDiscount;
    }
    SetDeliveryCharges(Charges) {
        this.DeliveryCharges = Charges;
    }
    SetDeliverySelectionCharges(DCharges) {
        this.DeliveryCharges = DCharges;
    }

    SetCouponDiscount(val) {
        this.CouponDiscount = val;

    }

    getOrderTax(): number {
        return this.OrderTax;
    }

    TotalCartQty = 0;
    TotalItems:number=0;
    getCartQty(lstCartList): number {
        this.TotalCartQty = 0;

        for (var i = 0; i < lstCartList.length; i++) {


            this.TotalCartQty = this.TotalCartQty + (+lstCartList[i].Qty);



        }
        
        $("#spnCartQty").html(this.TotalCartQty.toString());
        return this.TotalCartQty;
    }


    getOrderNetTotal(): number {


        var result = (this.OrderGrossAmount + this.OrderTax + this.DeliveryCharges) - ((+(typeof (this.OrderDiscount) != undefined ? this.OrderDiscount : '0')) + (+(typeof (this.CouponDiscount) != undefined ? this.CouponDiscount : '0')));
        if (result < 0) {
            this.CouponDiscount = 0;
        }

        return (result > 0 ? result : 0);
    }


    getTaxableAmount(): number {


        return this.TaxableAmount;
    }

    lstCartList: any = [];
    TaxableAmount = 0;
    CGSTPer:number = 0;
    SGSTPer:number = 0;
    GetTaxes(){
        
        let Taxes = (this.store as any).source['value']['MSECOM'].filter((x:any) => {
            return x.viewName == 'Taxes';
          });
          this.CGSTPer=Taxes[0].CGSTPer;
          this.SGSTPer=Taxes[0].SGSTPer;
    }
    CalcTotals(lstCartList) {
        debugger;
        this.CGSTPer=0;
        this.SGSTPer=0;
        this.GetTaxes()
        this.OrderGrossAmount = 0;
        this.OrderDiscount = 0;
        this.CGSTAmt=0;
       
        this.OrderTax = 0;
        this.SGSTAmt=0;
        this.TotalCartQty = 0;
    
        this.OrderNetTotal = 0;
        this.TaxableAmount = 0;
        for (var i = 0; i < lstCartList.length; i++) {
            debugger;
            this.OrderGrossAmount = this.OrderGrossAmount  + ((+lstCartList[i].SalesPrice) * (+lstCartList[i].Qty));
            this.OrderDiscount = this.OrderDiscount + (+ ((typeof (lstCartList[i].ProductDiscount) != 'undefined' && lstCartList[i].ProductDiscount != 'NaN') ? lstCartList[i].ProductDiscount : '0'));
            this.TotalCartQty = this.TotalCartQty + (+lstCartList[i].Qty);
            this.TaxableAmount = (+this.TaxableAmount)  + (((+lstCartList[i].SalesPrice) * (+lstCartList[i].Qty)))
        }

        this.TaxableAmount = (+this.TaxableAmount) - (+this.OrderDiscount) - (+(typeof (this.CouponDiscount) != undefined ? this.CouponDiscount : '0'));
        this.CGSTAmt= ((+this.TaxableAmount) * (+this.CGSTPer) / 100);
        this.SGSTAmt= ((+this.TaxableAmount) * (+this.SGSTPer) / 100);
        this.OrderTax=(+this.CGSTAmt)+(+ this.SGSTAmt);
        this.OrderNetTotal = (this.OrderGrossAmount + this.OrderTax ) ;
        // - (+(typeof (this.CouponDiscount) != undefined ? this.CouponDiscount : '0'))
        this.ApplyCouponCode=lstCartList[0]==undefined ? '':lstCartList[0].ApplyCouponCode;
        $("#spnCartQty").html(this.TotalCartQty.toString());
        this.TotalItems=this.getcartItems(lstCartList)
       
    }

    BuyNowTotals(lstCartList) {
        debugger;
        this.CGSTPer=0;
        this.SGSTPer=0;
        this.GetTaxes()
        this.OrderGrossAmount = 0;
        this.OrderDiscount = 0;
        this.CGSTAmt=0;
       
        this.OrderTax = 0;
        this.SGSTAmt=0;
        this.TotalCartQty = 0;
    
        this.OrderNetTotal = 0;
        this.TaxableAmount = 0;
        for (var i = 0; i < lstCartList.length; i++) {
            debugger;
            this.OrderGrossAmount = this.OrderGrossAmount  + ((+lstCartList[i].SalesPrice) * (+lstCartList[i].Qty));
            this.OrderDiscount = this.OrderDiscount + (+ ((typeof (lstCartList[i].ProductDiscount) != 'undefined' && lstCartList[i].ProductDiscount != 'NaN') ? lstCartList[i].ProductDiscount : '0'));
            this.TotalCartQty = this.TotalCartQty + (+lstCartList[i].Qty);
            this.TaxableAmount = (+this.TaxableAmount)  + (((+lstCartList[i].SalesPrice) * (+lstCartList[i].Qty)))
        }

        this.TaxableAmount = (+this.TaxableAmount) - (+this.OrderDiscount) - (+(typeof (this.CouponDiscount) != undefined ? this.CouponDiscount : '0'));
        this.CGSTAmt= ((+this.TaxableAmount) * (+this.CGSTPer) / 100);
        this.SGSTAmt= ((+this.TaxableAmount) * (+this.SGSTPer) / 100);
        this.OrderTax=(+this.CGSTAmt)+(+ this.SGSTAmt);
        this.OrderNetTotal = (this.OrderGrossAmount + this.OrderTax ) ;
        // - (+(typeof (this.CouponDiscount) != undefined ? this.CouponDiscount : '0'))
        this.ApplyCouponCode=lstCartList[0]==undefined ? '':lstCartList[0].ApplyCouponCode;
        
      
       
    }

   
    getcartItems(lstCartList){
        
        const uniqueProducts = lstCartList.reduce((result, product) => {
            // Use a Set to keep track of unique product IDs
            const idsSet = new Set(result.map(p => p.ProductID));
          
            // If the product's ID is not in the Set, add it to the result array
            if (!idsSet.has(product.ProductID)) {
              result.push(product);
            }
          
            // Return the intermediate result for the next iteration
            return result;
          }, []);

          return uniqueProducts.length;
    }

    constructor(private store: Store<any>) {

    }

    AddToCart(objCartList: CartList) {
        debugger;
        let cartDetails = (this.store as any).source['value']['MSECOM'].filter((x:any) => {
            return x.viewName == 'CartList';
          });
          if( cartDetails.length > 0) {
            this.lstCartList=Object.assign([],  cartDetails[0].lstCartList);
          }    

          debugger;
        
        var AddItem = true;
        for (let j = 0; j < this.lstCartList.length; j++) {
            debugger;
            if (
                
                this.lstCartList[j].ProductOptionID == objCartList.ProductOptionID &&
                this.lstCartList[j].OPName1 == objCartList.OPName1 &&
                this.lstCartList[j].OPName2 == objCartList.OPName2 &&
                this.lstCartList[j].OPName3 == objCartList.OPName3 &&

                this.lstCartList[j].OPName4 == objCartList.OPName4 ){
                // this.lstCartList[j].ExtraPieces == objCartList.ExtraPieces) {
                
                    var qtycheck=(+this.lstCartList[j].Qty) + (+objCartList.Qty)
                    if(qtycheck<=objCartList.ProductQty || qtycheck==objCartList.ProductQty){
                        this.lstCartList[j]['qtyValidation']=false;
                        this.lstCartList[j].Qty = (+this.lstCartList[j].Qty) + (+objCartList.Qty);
                    }
                
                AddItem = false;
                break

            }


        }

        if (AddItem) {
          
            debugger;
            this.lstCartList.push(objCartList)
           

        }

        this.CalcTotals(this.lstCartList);
    }

  

    getPurchaseqtyfromcart(PurchaseProduct){
        
        let cartDetails = (this.store as any).source['value']['MSECOM'].filter((x:any) => {
            return x.viewName == 'CartList';
          });
          if( cartDetails.length > 0) {
            this.lstCartList=Object.assign([],  cartDetails[0].lstCartList);
          }   
          
          for (let j = 0; j < this.lstCartList.length; j++) {
            if(this.lstCartList[j].ProductOptionID == PurchaseProduct.ProductOptionID &&
            this.lstCartList[j].OPName1 == PurchaseProduct.OPName1 &&
            this.lstCartList[j].OPName2 == PurchaseProduct.OPName2 &&
            this.lstCartList[j].OPName3 == PurchaseProduct.OPName3 &&

            this.lstCartList[j].OPName4 == PurchaseProduct.OPName4 ){


                return this.lstCartList[j].Qty;
            }

          }
    }

}

export class CartList {
    IsWishListItem: string;
    MerchantID: string;
    OrderID: string;
    ProductID: number;
    ProductCode: string;
    ProductLongDesc: string;
    ProductImage: string;
    ProductOptionID: number;
    OPGName1: string;
    OPGName2: string;
    OPGName3: string;
    OPGName4: string;
    ProductQty:number=0;
    ParentID: string;
    OPName1: string;
    OPName2: string;
    OPName3: string;
    OPName4: string;
    ExtraPieces: string;
    ProductDiscount: number;
    ProductNetTotal: number;
    ProductOptions: string;

    lstSet: any = [];

    CalcTotal() {
        
        this.MProductOptions();
        this.MProductDiscount();
        this.MProductNetTotal();
    }
    MProductOptions = () => {

        var res = "";
        if (typeof (this.OPName1) != 'undefined' && this.OPName1 != "") {
            res = res + (this.OPGName1 + ':' + this.OPName1);
        }
        if (typeof (this.OPName2) != 'undefined' && this.OPName2 != "") {
            res = res + '~' + (this.OPGName2 + ':' + this.OPName2);
        }
        if (typeof (this.OPName3) != 'undefined' && this.OPName3 != "") {
            res = res + '~' + (this.OPGName3 + ':' + this.OPName3);
        }

        if (typeof (this.OPName4) != 'undefined' && this.OPName4 != "") {
            res = res + '~' + (this.OPGName4 + ':' + this.OPName4);
        }

        this.ProductOptions = res;



    };
    ProductName: string;
    Qty: number;

    Price: number;
    SalesPrice: number;
    MProductDiscount = () => { this.ProductDiscount = (this.Qty * (this.Price - this.SalesPrice)) };
    MProductNetTotal = () => { this.ProductNetTotal = (this.Qty * (this.Price)) };

    SellerName: string;
    ExpectedDeliveryDate: string;
    //MerchantID:number;
    OrderDetailsStatus: string;






}
