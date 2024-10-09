import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnsexchangepolicyComponent } from './returnsexchangepolicy.component';

describe('ReturnsexchangepolicyComponent', () => {
  let component: ReturnsexchangepolicyComponent;
  let fixture: ComponentFixture<ReturnsexchangepolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnsexchangepolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnsexchangepolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
