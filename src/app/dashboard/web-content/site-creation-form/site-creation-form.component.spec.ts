import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteCreationFormComponent } from './site-creation-form.component';

describe('SiteCreationFormComponent', () => {
  let component: SiteCreationFormComponent;
  let fixture: ComponentFixture<SiteCreationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteCreationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteCreationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
