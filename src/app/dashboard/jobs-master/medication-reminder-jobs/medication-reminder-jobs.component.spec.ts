import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicationReminderJobsComponent } from './medication-reminder-jobs.component';

describe('MedicationReminderJobsComponent', () => {
  let component: MedicationReminderJobsComponent;
  let fixture: ComponentFixture<MedicationReminderJobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicationReminderJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicationReminderJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
