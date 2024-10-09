import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddressComponent } from './address/address.component';
import { CartComponent } from './cart/cart.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryDetByParentCategoryComponent } from './category-det-by-parent-category/category-det-by-parent-category.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { HomeComponent } from './home/home.component';
import { OrdersComponent } from './orders/orders.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProductDetailsByTypeComponent } from './product-details-by-type/product-details-by-type.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductSearchAndFilterComponent } from './product-search-and-filter/product-search-and-filter.component';
import { ProductsComponent } from './products/products.component';
import { ThankyouPageComponent } from './thankyou-page/thankyou-page.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { MyWishlistComponent } from './my-wishlist/my-wishlist.component';
import { AppModule } from './app.module';

const routes: Routes = [ 
  {
    path: '',
    component:HomeComponent,
    pathMatch: 'full'
    
  }, {
    path: 'home',
    component:HomeComponent,
    pathMatch: 'full'
  },
  
  {path:'CategoryDetByParentCategory' ,component:CategoryDetByParentCategoryComponent, pathMatch: 'full'},

  {path:'ProductDetailsByType' ,component:ProductDetailsByTypeComponent, pathMatch: 'full'},

  {path:'ProductSearchAndFilter' ,component:ProductSearchAndFilterComponent, pathMatch: 'full'},

  {
    path: 'products',
    component:ProductsComponent,
    pathMatch: 'full'
  },
  {
    path: 'categories',
    component:CategoriesComponent,
    pathMatch: 'full'
  },
  {
    path: 'ProductDetails',
    component:ProductDetailsComponent,
    pathMatch: 'full'
  },
  {
    path: 'cart',
    component:CartComponent,
    pathMatch: 'full'
  },
  {
    path: 'checkout',
    component:CheckoutComponent,
    pathMatch: 'full'
  },
  {
    path: 'pagenotfound',
    component:PageNotFoundComponent,
    pathMatch: 'full'
  },
  {
    path: 'address',
    component:AddressComponent,
    pathMatch: 'full'
  },
  {
    path: 'editprofile',
    component:EditProfileComponent,
    pathMatch: 'full'
  },
  {
    path: 'orders',
    component:OrdersComponent,
    pathMatch: 'full'
  },
  {
    path: 'userlogin',
    component:UserLoginComponent,
    pathMatch: 'full'
  },
  {
    path: 'registration',
    component:UserRegistrationComponent,
    pathMatch: 'full'
  },
  {
    path: 'thankyoupage',
    component:ThankyouPageComponent,
    pathMatch: 'full'
  },
  {
    path: 'MyWishList',
    component:MyWishlistComponent,
    pathMatch: 'full'
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
