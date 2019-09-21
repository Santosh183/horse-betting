import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRaceComponent } from './delete-race.component';

describe('DeleteRaceComponent', () => {
  let component: DeleteRaceComponent;
  let fixture: ComponentFixture<DeleteRaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteRaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteRaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
