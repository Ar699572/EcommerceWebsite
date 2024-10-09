import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsByTypeComponent } from './product-details-by-type.component';

describe('ProductDetailsByTypeComponent', () => {
  let component: ProductDetailsByTypeComponent;
  let fixture: ComponentFixture<ProductDetailsByTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductDetailsByTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailsByTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
