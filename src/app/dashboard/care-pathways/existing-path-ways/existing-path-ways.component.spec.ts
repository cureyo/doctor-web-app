import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingPathWaysComponent } from './existing-path-ways.component';

describe('ExistingPathWaysComponent', () => {
  let component: ExistingPathWaysComponent;
  let fixture: ComponentFixture<ExistingPathWaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExistingPathWaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingPathWaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
