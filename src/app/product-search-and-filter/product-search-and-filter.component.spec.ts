import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSearchAndFilterComponent } from './product-search-and-filter.component';

describe('ProductSearchAndFilterComponent', () => {
  let component: ProductSearchAndFilterComponent;
  let fixture: ComponentFixture<ProductSearchAndFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductSearchAndFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSearchAndFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
