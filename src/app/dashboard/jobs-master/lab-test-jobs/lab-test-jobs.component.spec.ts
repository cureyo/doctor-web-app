import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabTestJobsComponent } from './lab-test-jobs.component';

describe('LabTestJobsComponent', () => {
  let component: LabTestJobsComponent;
  let fixture: ComponentFixture<LabTestJobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabTestJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabTestJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
