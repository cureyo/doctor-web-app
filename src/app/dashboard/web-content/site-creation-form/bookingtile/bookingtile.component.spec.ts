import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingtileComponent } from './bookingtile.component';

describe('BookingtileComponent', () => {
  let component: BookingtileComponent;
  let fixture: ComponentFixture<BookingtileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingtileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingtileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
