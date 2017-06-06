import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorCheckupComponent } from './doctorcheckup.component';

describe('DoctorCheckupComponent', () => {
  let component: DoctorCheckupComponent;
  let fixture: ComponentFixture<DoctorCheckupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorCheckupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorCheckupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
