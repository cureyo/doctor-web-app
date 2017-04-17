import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalconsultationJobsComponent } from './physicalconsultation-jobs.component';

describe('PhysicalconsultationJobsComponent', () => {
  let component: PhysicalconsultationJobsComponent;
  let fixture: ComponentFixture<PhysicalconsultationJobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalconsultationJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalconsultationJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
