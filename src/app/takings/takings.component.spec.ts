import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TakingsComponent } from './takings.component';

describe('TakingsComponent', () => {
  let component: TakingsComponent;
  let fixture: ComponentFixture<TakingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TakingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
