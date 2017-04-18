import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HerotilesComponent } from './herotiles.component';

describe('HerotilesComponent', () => {
  let component: HerotilesComponent;
  let fixture: ComponentFixture<HerotilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HerotilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HerotilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
