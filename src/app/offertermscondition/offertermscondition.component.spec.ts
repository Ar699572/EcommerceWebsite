import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffertermsconditionComponent } from './offertermscondition.component';

describe('OffertermsconditionComponent', () => {
  let component: OffertermsconditionComponent;
  let fixture: ComponentFixture<OffertermsconditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OffertermsconditionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OffertermsconditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
