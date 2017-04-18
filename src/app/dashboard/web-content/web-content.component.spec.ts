import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebContentComponent } from './web-content.component';

describe('WebContentComponent', () => {
  let component: WebContentComponent;
  let fixture: ComponentFixture<WebContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
