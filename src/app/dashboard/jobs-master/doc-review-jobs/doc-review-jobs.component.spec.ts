import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocReviewJobsComponent } from './doc-review-jobs.component';

describe('DocReviewJobsComponent', () => {
  let component: DocReviewJobsComponent;
  let fixture: ComponentFixture<DocReviewJobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocReviewJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocReviewJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
