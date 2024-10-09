
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { CategoriesComponent } from './categories/categories.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { DatePipe, LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common';
import { ApplicationSettings } from './model/ApplicationSettings';
 import { NgxStarRatingModule } from 'ngx-star-rating';
 import { NgxPayPalModule } from 'ngx-paypal';
import { StoreModule } from '@ngrx/store';
import { Pagereducer } from './Store/PageStore/Page.Reducer';
import { NgxAuthorizenetModule } from 'ngx-authorizenet';
import { localStorageSync } from 'ngrx-store-localstorage';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { OwlModule } from 'ngx-owl-carousel';
import { CategoryDetByParentCategoryComponent } from './category-det-by-parent-category/category-det-by-parent-category.component';
import { ProductDetailsByTypeComponent } from './product-details-by-type/product-details-by-type.component';
import { UniqueOptions } from './UniqueOptions';
import { UniqueOptionGroups } from './UniqueOptionGroups';
import { ProductSearchAndFilterComponent } from './product-search-and-filter/product-search-and-filter.component';
import { AddressComponent } from './address/address.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { OrdersComponent } from './orders/orders.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { ThankyouPageComponent } from './thankyou-page/thankyou-page.component';
import { MyWishlistComponent } from './my-wishlist/my-wishlist.component';
import { ShippingpolicyComponent } from './shippingpolicy/shippingpolicy.component';
import { RouterModule, Routes } from '@angular/router';
import { ReturnsexchangepolicyComponent } from './returnsexchangepolicy/returnsexchangepolicy.component';
import { TermsconditionComponent } from './termscondition/termscondition.component';
import { OffertermsconditionComponent } from './offertermscondition/offertermscondition.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { NgxGalleryModule } from 'ngx-gallery-9';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const AppRoute:Routes=[
  {path:'shipping',component:ShippingpolicyComponent},
   {path:'returns',component:ReturnsexchangepolicyComponent},
   {path:'termscondition',component:TermsconditionComponent},
   {path:'offerterms',component:OffertermsconditionComponent},
   {path:'privacy&policy',component:PrivacypolicyComponent}
   
]

export function localStorageSyncReducer(rootReducer: any)
 {
  return localStorageSync({ keys: ['MSECOM'], rehydrate: true })(rootReducer);
}
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductsComponent,
    CategoriesComponent,
    UniqueOptions,
    UniqueOptionGroups,
    ProductDetailsComponent,
    CartComponent,
    CheckoutComponent,
    PageNotFoundComponent,
    CategoryDetByParentCategoryComponent,
    ProductDetailsByTypeComponent,
   
    ProductSearchAndFilterComponent,
    AddressComponent,
    EditProfileComponent,
    OrdersComponent,
    UserLoginComponent,
    UserRegistrationComponent,
    ThankyouPageComponent,
    MyWishlistComponent,
    ShippingpolicyComponent,
    ReturnsexchangepolicyComponent,
    TermsconditionComponent,
    PrivacypolicyComponent,

  ],
  imports: [
    BrowserModule,
    CommonModule,
     NgxStarRatingModule,
    FormsModule,
    BrowserAnimationsModule,
   NgxGalleryModule,
     NgxPayPalModule,

    ReactiveFormsModule,
    HttpClientModule,
  RouterModule.forRoot(AppRoute),
    NgxAuthorizenetModule,
    AppRoutingModule,
    OwlModule,
    StoreModule.forRoot({MSECOM: Pagereducer
    
    
    },{
      metaReducers:[localStorageSyncReducer]
    }),
  ],
  providers: [
   
    
    DatePipe, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
export function resourceProviderFactory(provider: ApplicationSettings) {

  return () => provider.getSettings();
  }