import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorMessagePopupComponent } from './error-message-popup.component';

describe('ErrorMessagePopupComponent', () => {
  let component: ErrorMessagePopupComponent;
  let fixture: ComponentFixture<ErrorMessagePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorMessagePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorMessagePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
