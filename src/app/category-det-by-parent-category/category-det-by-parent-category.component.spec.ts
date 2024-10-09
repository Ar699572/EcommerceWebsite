import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryDetByParentCategoryComponent } from './category-det-by-parent-category.component';

describe('CategoryDetByParentCategoryComponent', () => {
  let component: CategoryDetByParentCategoryComponent;
  let fixture: ComponentFixture<CategoryDetByParentCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryDetByParentCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryDetByParentCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
