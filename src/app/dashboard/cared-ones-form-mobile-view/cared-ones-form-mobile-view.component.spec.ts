import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaredOnesFormMobileViewComponent } from './cared-ones-form-mobile-view.component';

describe('CaredOnesFormMobileViewComponent', () => {
  let component: CaredOnesFormMobileViewComponent;
  let fixture: ComponentFixture<CaredOnesFormMobileViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaredOnesFormMobileViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaredOnesFormMobileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
