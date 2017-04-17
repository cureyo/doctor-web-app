import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsMasterComponent } from './jobs-master.component';

describe('JobsMasterComponent', () => {
  let component: JobsMasterComponent;
  let fixture: ComponentFixture<JobsMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
