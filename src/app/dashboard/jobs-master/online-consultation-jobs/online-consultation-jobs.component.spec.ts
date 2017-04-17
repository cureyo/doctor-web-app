import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineConsultationJobsComponent } from './online-consultation-jobs.component';

describe('OnlineConsultationJobsComponent', () => {
  let component: OnlineConsultationJobsComponent;
  let fixture: ComponentFixture<OnlineConsultationJobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineConsultationJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineConsultationJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
