import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseTrackerJobsComponent } from './exercise-tracker-jobs.component';

describe('ExerciseTrackerJobsComponent', () => {
  let component: ExerciseTrackerJobsComponent;
  let fixture: ComponentFixture<ExerciseTrackerJobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExerciseTrackerJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseTrackerJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
