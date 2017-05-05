import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FbAdsFormComponent } from './fb-ads-form.component';

describe('FbAdsFormComponent', () => {
  let component: FbAdsFormComponent;
  let fixture: ComponentFixture<FbAdsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FbAdsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FbAdsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
