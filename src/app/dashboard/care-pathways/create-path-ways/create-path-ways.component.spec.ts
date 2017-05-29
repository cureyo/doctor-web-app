import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePathWaysComponent } from './create-path-ways.component';

describe('CreatePathWaysComponent', () => {
  let component: CreatePathWaysComponent;
  let fixture: ComponentFixture<CreatePathWaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePathWaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePathWaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
