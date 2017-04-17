import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodsugarJobsComponent } from './bloodsugar-jobs.component';

describe('BloodsugarJobsComponent', () => {
  let component: BloodsugarJobsComponent;
  let fixture: ComponentFixture<BloodsugarJobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BloodsugarJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BloodsugarJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
