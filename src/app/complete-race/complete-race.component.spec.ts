import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteRaceComponent } from './complete-race.component';

describe('CompleteRaceComponent', () => {
  let component: CompleteRaceComponent;
  let fixture: ComponentFixture<CompleteRaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompleteRaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteRaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
